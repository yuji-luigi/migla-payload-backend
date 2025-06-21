import { Endpoint, Payload } from 'payload'
import { parseExcelToJson } from '../../../lib/excel/parseExcelToJson'
import { Classroom, Student, User } from '../../../payload-types'
import { ParentStudentExcel } from '../../classrooms/types/parent-student-excel'
import { AvailableLocale, availableLocales } from '../../../lib/i18n/i18n_configs'
import {
  handleTransformStudentExcel,
  studentExcelToStudent,
} from '../dto/parentStutentExcelToStudent'

export const importStudents: Omit<Endpoint, 'root'> = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
    const createdStudents: Student[] = []
    const updatedStudents: Student[] = []
    const formData = await req.formData?.()
    let errors: Record<string, string>[] = []
    if (formData?.get('file') instanceof File) {
      const json = await parseExcelToJson<ParentStudentExcel>(formData.get('file') as File)
      const {
        docs: [parentRole],
      } = await req.payload.find({
        collection: 'roles',
        where: {
          isParent: {
            equals: true,
          },
        },
      })
      const { docs: foundUsers } = await req.payload.find({
        collection: 'users',
        where: {
          email: {
            in: json.map((row) => row.メール),
          },
        },
      })
      const { docs: foundStudents } = await req.payload.find({
        collection: 'students',
        where: {
          parent: {
            in: foundUsers.map((user) => user.id),
          },
        },
      })

      const { docs: classrooms } = await req.payload?.find({
        collection: 'classrooms',
        locale: 'ja',
      })
      for (const row of json) {
        try {
          const matchedParent = foundUsers.find((user) => user.email === row.メール)

          if (matchedParent) {
            const classroom = classrooms.find((classroom) => classroom.name === row.クラス)
            if (!classroom) {
              throw new Error(`Classroom not found for student ${row.クラス}`)
            }
            await handleUpdateStudent({
              payload: req.payload,
              parent: matchedParent,
              classroom,
              locale: 'ja',
              excelRow: row,
            })
          }
          const newStudent = await req.payload.create({
            collection: 'students',
            data: handleTransformStudentExcel(row, {
              locale: 'ja',
              parents: foundUsers,
              classrooms,
            }),
          })
          createdStudents.push(newStudent)
          if (!newStudent.classroom) {
            throw new Error('Classroom not found')
          }
          const classroom =
            typeof newStudent.classroom == 'number'
              ? newStudent.classroom
              : newStudent.classroom && newStudent.classroom!.id
          if (!newStudent.parent) {
            throw new Error('Parent not found')
          }
          const parent = newStudent.parent.map((parent) => {
            if (typeof parent == 'number') {
              return parent
            }
            return parent.id
          })
          for (const locale of availableLocales.filter((locale) => locale !== 'ja')) {
            await req.payload.update({
              collection: 'students',
              id: newStudent.id,
              locale,
              data: {
                ...studentExcelToStudent(row, {
                  locale,
                }),
                classroom,
                parent,
              },
            })
          }
        } catch (err) {
          // err might be an Error or something else
          const message = err instanceof Error ? err.message : String(err)
          // use row.surname (or whatever identifies the row)
          errors.push({
            [`${row.student_name_ja} ${row.student_surname_ja}`]: message,
          })
        }
      }
    }

    return Response.json(
      {
        updated: [],
        created: [],
        errors,
        message: errors.length > 0 ? 'Some errors occurred' : 'Success!',
      },
      {
        status: errors.length > 0 ? 400 : 200,
      },
    )
  },
}

function ExcelToStudent({
  json,
  parents,
  classrooms,
  locale,
}: {
  json: ParentStudentExcel[]
  parents: User[]
  classrooms: Classroom[]
  locale: AvailableLocale
}) {
  const errors: Record<string, string>[] = []
  //0. get all users with in emails[] get existing students.
  //1. check existing users
  //2. user exists then set parent role -> update user (name, surname, by )
  //3. check student exists -> update student (set parent classroom)
  //4.
  const studentsDto = json.map((parentStudentExcel) => {
    const parent = parents.find((parent) => parent.email === parentStudentExcel.メール)
    const classroom = classrooms.find((classroom) => classroom.name === parentStudentExcel.クラス)
    if (!parent) {
      errors.push({
        [parentStudentExcel.メール]: `Parent not found for student ${parentStudentExcel.メール}`,
      })
      return null
    }
    if (!classroom) {
      errors.push({
        [parentStudentExcel.メール]: `Classroom not found for student ${parentStudentExcel.クラス}`,
      })
      return null
    }
    return {
      surname: parentStudentExcel[`student_surname_${locale}`],
      name: parentStudentExcel[`student_name_${locale}`],
      guardianSurname: parentStudentExcel[`parent_surname_${locale}`],
      guardianName: parentStudentExcel[`parent_name_${locale}`],
      email: parentStudentExcel.メール,
      phone: parentStudentExcel.電話番号,
      grade: parentStudentExcel.クラス,
      parent: parent?.id,
      classroom: classroom?.id,
    }
  })

  return {
    dto: studentsDto,
    errors,
  }
}
// function ExcelToStudent(json: )

async function handleUpdateStudent({
  payload,
  excelRow,
  parent,
  classroom,
  locale,
}: {
  payload: Payload
  excelRow: ParentStudentExcel
  parent: User
  classroom: Classroom
  locale: AvailableLocale
}) {
  const student: Omit<Student, 'id' | 'updatedAt' | 'createdAt'> = {
    ...studentExcelToStudent(excelRow, {
      locale,
    }),
    parent: [parent.id],
    classroom,
  }
  throw new Error('Not implemented')
}
