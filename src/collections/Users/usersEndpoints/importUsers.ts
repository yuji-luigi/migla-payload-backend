import { Endpoint, Payload } from 'payload'
import { parseExcelToJson } from '../../../lib/excel/parseExcelToJson'
import { Classroom, Role, Student, User } from '../../../payload-types'
import { cn } from '../../../utilities/ui'
import { consolidateHTMLConverters } from '@payloadcms/richtext-lexical'

export const importUsers: Omit<Endpoint, 'root'> = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
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

      const promises = dto.filter(Boolean).map((user) => async () => {
        console.log('user')
        console.log(user)
        if (!user) return
        const updateUser = sameUsers.docs.find((u) => u.email === user.email)
        let userId = updateUser?.id
        if (updateUser) {
          await req.payload.update({
            collection: 'users',
            id: updateUser.id,
            data: user,
          })
        } else {
          const newUser = await req.payload.create({
            collection: 'users',
            data: user,
          })
          userId = newUser.id
        }
        if (
          user.roles?.some((r) => typeof r === 'object' && 'isTeacher' in r && r.isTeacher) &&
          user.classroomName
        ) {
          const classroom = await req.payload.find({
            collection: 'classrooms',
            where: {
              name: { equals: user.classroomName },
            },
          })
          if (classroom.docs[0]) {
            await req.payload.create({
              collection: 'teachers',
              data: {
                user: userId,
                name: `${user.surname} ${user.name}`,
                classroom: classroom.docs[0].id,
              },
            })
          }
        }
      })
      await Promise.all(promises.map((run) => run()))
    }

    return Response.json({
      message: `Hello ${req.routeParams?.name as string} @ ${req.routeParams?.group as string}`,
    })
  },
}

type UserExcel = {
  メール: string
  名: string
  姓: string
  役割: string
  電話番号: number
  クラス: string
  パスワード: string
}
type UserDto = Omit<
  User & {
    classroomName?: string
    roles: Role[] | null
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
        // phone: user.電話番号,
        roles: roles,
      }
    })
    .filter(isUserDto)
  console.log(dto)
  return {
    dto: dto,
    errors,
  }
}
// function ExcelToStudent(json: )
