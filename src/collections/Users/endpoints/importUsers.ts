import { APIError, Endpoint, PaginatedDocs, Payload } from 'payload'
import { parseExcelToJson } from '../../../lib/excel/parseExcelToJson'
import { Classroom, Role, Student, User } from '../../../payload-types'
import { cn } from '../../../utilities/ui'
import { consolidateHTMLConverters } from '@payloadcms/richtext-lexical'
import { notEmpty } from '../../../lib/notEmpty'
import { ImportResult } from '../../../types/responses/importResponse'
import { ResultUser } from '../types/result-user'

export const importUsers: Omit<Endpoint, 'root'> = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
    const result: {
      updated: ResultUser[]
      created: ResultUser[]
      errors: Record<string, string>[]
      message?: string
    } = {
      updated: [],
      created: [],
      errors: [],
    }
    const formData = await req.formData?.()
    if (formData?.get('file') instanceof File) {
      const json = (await parseExcelToJson(formData.get('file') as File)) as UserExcel[]
      const distRoles = [...new Set(json.map((user) => user.役割))]
      const parentRoles = await req.payload.find({
        collection: 'roles',
        where: {
          slug: {
            in: distRoles,
          },
        },
      })
      const sameUsers = await req.payload.find({
        collection: 'users',
        where: {
          email: {
            in: json.map((user) => user.メール),
          },
        },
      })
      const notFoundRoles = distRoles.filter(
        (role) => !parentRoles.docs.some((r) => r.slug === role),
      )

      const { dto, errors } = ExcelToUser({
        excelRows: json,
        rolesDb: parentRoles.docs,
        payload: req.payload,
      })
      const promises = dto.filter(notEmpty).map(
        // wrap in promise to make it callable after.
        (user) => async () => handleCreateUsers({ user, sameUsers, payload: req.payload, result }),
      )
      await Promise.all(promises.map((run) => run()))
      return Response.json(result)
    }
    return Response.json({ ...result, message: 'No operation' })
  },
}

type UserExcel = {
  メール: string
  名: string
  姓: string
  読み: string
  役割: string
  電話番号: number
  クラス: string
  パスワード: string
}
type UserDto = Omit<
  User & {
    classroomName?: string
    roles: Role[] | null
    slug: string
  },
  'id' | 'updatedAt' | 'createdAt'
>

// a quick type-guard:
function isUserDto(u: UserDto | null): u is UserDto {
  if (u === null) return false
  if (u.surname === null) return false
  if (u.name === null) return false
  if (u.email === null) return false
  if (u.password === null) return false
  if (u.slug === null) return false
  if (u?.roles?.length === 0) return false
  return true
}
function ExcelToUser({
  excelRows,
  rolesDb,
  payload,
}: {
  excelRows: UserExcel[]
  rolesDb: Role[]
  payload: Payload
}): { dto: ((UserDto & { roles: Role[] | null }) | null)[]; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  const dto = excelRows
    .map((user) => {
      const roles = rolesDb.filter((role) =>
        user.役割
          ?.toLowerCase()
          .split(',')
          .some((roleInExcel) => roleInExcel === role.slug?.toLowerCase()),
      )
      if (!roles) {
        errors[user.メール] = `役割が見つかりません: ${user.役割}`
        return null
      }
      if (roles.some((r) => r.isParent)) {
        // errors[user.メール] = `保護者はインポートできません: ${user.役割}`
        // return null
      }

      return {
        surname: user.姓,
        name: user.名,
        email: user.メール,
        classroomName: user.クラス,
        password: user.パスワード,
        slug: user.読み,
        /* .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '')
          .toLowerCase() */
        roles: roles,
      }
    })
    .filter(isUserDto)
  return {
    dto: dto,
    errors,
  }
}
// function ExcelToStudent(json: )

function buildResultUser(user: UserDto) {
  return {
    fullname: `${user.name} ${user.surname}`,
    email: user.email,
    roles: user.roles?.map((role) => (typeof role === 'object' ? role.name : role.toString())),
  }
}

function userHasTeacherRole(user: UserDto) {
  return user.roles?.some((r) => typeof r === 'object' && 'isTeacher' in r && r.isTeacher)
}

async function handleCreateTeacher({
  user,
  payload,
  classroomName,
}: {
  user: UserDto & { id: number }
  payload: Payload
  classroomName: string
}) {
  const classroom = await payload.find({
    collection: 'classrooms',
    where: {
      name: { equals: user.classroomName },
    },
  })
  if (classroom.docs[0]) {
    await payload.create({
      collection: 'teachers',
      data: {
        user: user.id,
        name: `${user.surname} ${user.name}`,
        classroom: classroom.docs[0].id,
        slug: user.slug,
      },
    })
  }
}

async function handleCreateUsers({
  user,
  sameUsers,
  payload,
  result,
}: {
  user: (UserDto & { roles: Role[] | null }) | null
  sameUsers: PaginatedDocs<User>
  payload: Payload
  result: ImportResult<ResultUser>
}) {
  if (!user) return
  try {
    const foundUser = sameUsers.docs.find((u) => u.email === user.email)
    let userId = foundUser?.id
    if (foundUser) {
      const updatedUser = await payload.update({
        collection: 'users',
        id: foundUser.id,
        data: user,
      })
      result.updated.push(buildResultUser(user))
      //! DELETING ALL THE TEACHERS RECORDS FOR UPDATING USER. SINCE IF THE USER HAS TEACHER ROLE IT WILL BE RE CREATED.
      await payload.delete({
        collection: 'teachers',
        where: {
          user: {
            equals: updatedUser.id,
          },
        },
      })

      if (userHasTeacherRole(user) && user.classroomName) {
        await handleCreateTeacher({
          user: { ...user, id: updatedUser.id },
          payload: payload,
          classroomName: user.classroomName,
        })
      }
    } else {
      const newUser = await payload.create({
        collection: 'users',
        data: user,
      })
      result.updated.push(buildResultUser(user))
      userId = newUser.id
      if (userHasTeacherRole(user) && user.classroomName) {
        await handleCreateTeacher({
          user: { ...user, id: newUser.id },
          payload: payload,
          classroomName: user.classroomName,
        })
      }
    }
  } catch (error: unknown) {
    if (error instanceof APIError) {
      const path = error.data.errors?.[0]?.path
      const fieldKey = user.email || `${user.name} ${user.surname}`
      result.errors.push({
        [fieldKey]: `${error.message}: ${user[path as keyof UserDto] || ''}`,
      })
    }
  }
}
