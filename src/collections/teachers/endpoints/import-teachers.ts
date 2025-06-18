import { Endpoint, PayloadRequest } from 'payload'
import { ClassroomExcel } from '../../classrooms/types/classroom-excel'
import { parseExcelToJson, parseRequestToExcelJson } from '../../../lib/excel/parseExcelToJson'
import { Sailboat } from 'lucide-react'
import { ImportResult } from '../../../types/responses/importResponse'
import { Classroom, Role } from '../../../payload-types'
import { TeacherExcel } from '../../classrooms/types/teacher-excel'
import { assert } from 'console'
import { teacherExcelToUser } from '../../Users/dto/teacher_excel_to_user'
import { teacherExcelToTeacher } from '../dto/excel_to_teacher'

export const importTeachers: Omit<Endpoint, 'root'> = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
    const json = await parseRequestToExcelJson<TeacherExcel>(req)
    const locales = ['ja', 'en', 'it'] as const
    const errors: Record<string, string>[] = []
    const created: Classroom[] = []
    const updated: Classroom[] = []

    const emails = json.map((item) => item.email)
    const { docs: existingUsers } = await req.payload.find({
      collection: 'users',
      where: {
        email: {
          in: emails,
        },
      },
    })
    const {
      docs: [roleTeacher],
    } = await req.payload.find({
      collection: 'roles',
      where: {
        isTeacher: {
          equals: true,
        },
      },
    })

    assert(!roleTeacher?.isTeacher, 'Role teacher not found')

    const { docs: existingTeachers } = await req.payload.find({
      collection: 'teachers',
      where: {
        id: {
          in: existingUsers.map((user) => user.id),
        },
      },
    })
    const nonExistingUsersExcel = json.filter(
      (row) => !existingUsers.some((user) => user.email === row.email),
    )
    const restLocales = locales.filter((locale) => locale !== 'ja')
    const createUsersTeachersPromises = nonExistingUsersExcel.map((row) => async () => {
      const user = await req.payload.create({
        collection: 'users',
        data: teacherExcelToUser({
          row: row,
          locale: 'ja',
          roleTeacher: roleTeacher as Role & { isTeacher: true },
        }),
      })
      for (const locale of restLocales) {
        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: teacherExcelToUser({
            row: row,
            locale: locale,
            roleTeacher: roleTeacher as Role & { isTeacher: true },
          }),
        })
      }

      const {
        docs: [classroom],
      } = await req.payload.find({
        collection: 'classrooms',
        locale: 'ja',
        where: {
          name: {
            equals: row.classroom_ja,
          },
        },
        limit: 1,
      })
      if (!classroom) {
        throw new Error(`Classroom ${row.classroom_ja} not found`)
      }
      const newTeacher = await req.payload.create({
        collection: 'teachers',
        locale: 'ja',
        data: teacherExcelToTeacher({
          row: row,
          locale: 'ja',
          userId: user.id,
          classroomId: classroom.id,
        }),
      })
      for (const locale of restLocales) {
        await req.payload.update({
          collection: 'teachers',
          id: newTeacher.id,
          data: teacherExcelToTeacher({
            row: row,
            locale: locale,
            userId: user.id,
            classroomId: classroom.id,
          }),
        })
      }
    })

    const promises = json.map((item, index) => async () => {
      try {
      } catch (error) {
        const deformedItem = item as unknown as Record<string, string>
        const keys = Object.keys(deformedItem)
        errors.push({
          row: keys.map((key) => deformedItem[key] || '').join(', '),
          message: error instanceof Error ? `${error.message} ` : 'Unknown error',
        })
      }
    })
    await Promise.all(promises.map((call) => call()))
    return Response.json({
      updated,
      created,
      errors,
      message: errors.length > 0 ? 'Some errors occurred' : 'Success!',
    })
  },
}
