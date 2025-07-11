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
import { availableLocales, availableLocalesWithoutJa } from '../../../lib/i18n/i18n_configs'

export const importTeachers: Omit<Endpoint, 'root'> = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
    const json = await parseRequestToExcelJson<TeacherExcel>(req)
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

    if (!roleTeacher) {
      throw new Error('Role teacher not found')
    }

    const nonExistingUsersExcel = json.filter(
      (row) => !existingUsers.some((user) => user.email === row.email),
    )

    const createUsersTeachersPromises = nonExistingUsersExcel.map((row) =>
      handleCreateTeacherUsers({ row, req, roleTeacher }),
    )

    const updateTeachersUsersPromises = existingUsers.map((user) => async () => {
      const row = json.find((item) => item.email === user.email)
      if (!row) {
        throw new Error(`Row not found for user ${user.email}`)
      }
      const classroomName = row.classroom_ja

      const {
        docs: [foundClassroom],
      } = await req.payload.find({
        collection: 'classrooms',
        locale: 'ja',
        where: {
          name: {
            equals: classroomName,
          },
        },
      })

      const {
        docs: [upTeacher],
      } = await req.payload.find({
        collection: 'teachers',
        locale: 'ja',
        where: {
          user: {
            equals: user.id,
          },
        },
        limit: 1,
      })

      for (const locale of availableLocales) {
        /** update user */
        await req.payload.update({
          collection: 'users',
          id: user.id,
          locale,
          data: {
            ...teacherExcelToUser({
              row: row,
              locale: locale,
              roleTeacher: roleTeacher as Role & { isTeacher: true },
            }),
            roles: [
              // set existing role + roleTeacher + eliminate duplicates
              ...new Set([
                roleTeacher.id,
                ...(user.roles?.map((role) => (typeof role === 'number' ? role : role.id)) ?? []),
              ]),
            ],
          },
        })
        /** update teacher */
        if (upTeacher) {
          await req.payload
            .update({
              collection: 'teachers',
              id: upTeacher.id,
              locale,
              data: {
                ...teacherExcelToTeacher({
                  row: row,
                  locale: locale,
                  userId: user.id,
                  classroomId: foundClassroom?.id ?? null,
                }),
              },
            })
            .catch((error) => {
              errors.push({
                row: row.email,
                message: error.message,
              })
            })
        }
      }
      /** create teacher */
      if (!upTeacher) {
        /** create ja teacher first then iterate over rest locales */
        const newTeacher = await req.payload.create({
          collection: 'teachers',
          locale: 'ja',
          data: teacherExcelToTeacher({
            row: row,
            locale: 'ja',
            userId: user.id,
            classroomId: foundClassroom?.id ?? null,
          }),
        })
        for (const locale of availableLocalesWithoutJa) {
          /** set other locales */
          await req.payload.update({
            collection: 'teachers',
            id: newTeacher.id,
            locale,
            data: {
              ...teacherExcelToTeacher({
                row: row,
                locale: locale,
                userId: user.id,
                classroomId: foundClassroom?.id ?? null,
              }),
            },
          })
        }
      }
    })

    await Promise.all(createUsersTeachersPromises.map((call) => call()))
    await Promise.all(updateTeachersUsersPromises.map((call) => call()))
    return Response.json({
      updated,
      created,
      errors,
      message: errors.length > 0 ? 'Some errors occurred' : 'Success!',
    })
  },
}

function handleCreateTeacherUsers({
  row,
  req,
  roleTeacher,
}: {
  row: TeacherExcel
  req: PayloadRequest
  roleTeacher: Role
}) {
  return async () => {
    const user = await req.payload.create({
      collection: 'users',
      locale: 'ja',
      data: teacherExcelToUser({
        row: row,
        locale: 'ja',
        roleTeacher: roleTeacher as Role & { isTeacher: true },
      }),
    })
    for (const locale of availableLocalesWithoutJa) {
      await req.payload
        .update({
          collection: 'users',
          locale,
          id: user.id,
          data: teacherExcelToUser({
            row: row,
            locale: locale,
            roleTeacher: roleTeacher as Role & { isTeacher: true },
          }),
        })
        .catch((error) => {
          // errors.push({
          //   row: row.email,
          //   message: error.message,
          // })
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

    const newTeacher = await req.payload.create({
      collection: 'teachers',
      locale: 'ja',
      data: teacherExcelToTeacher({
        row: row,
        locale: 'ja',
        userId: user.id,
        classroomId: classroom?.id ?? null,
      }),
    })
    for (const locale of availableLocalesWithoutJa) {
      if (row[`teacher_name_${locale}`]) {
        await req.payload.update({
          collection: 'teachers',
          id: newTeacher.id,
          locale,
          data: teacherExcelToTeacher({
            row: row,
            locale: locale,
            userId: user.id,
            classroomId: classroom?.id ?? null,
          }),
        })
      }
    }
  }
}
