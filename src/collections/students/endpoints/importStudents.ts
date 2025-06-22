import { Endpoint, getPayload, Payload, PayloadRequest } from 'payload'
import { parseExcelToJson } from '../../../lib/excel/parseExcelToJson'
import { Classroom, Role, Student, User } from '../../../payload-types'
import { ParentStudentExcel } from '../../classrooms/types/parent-student-excel'
import { AvailableLocale, availableLocales } from '../../../lib/i18n/i18n_configs'
import {
  handleTransformStudentExcel,
  studentExcelToStudent,
} from '../dto/parentStutentExcelToStudent'
import { excelSerialToDate } from '../../../utilities/excelSerialToDate'
import { handleCreateUserFromStudentExcel } from '../helper/handleCreateUserFromStudentExcel'

let parentRole: Role | null = null

export const importStudents: Omit<Endpoint, 'root'> = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
    try {
      if (!req.user?.currentRole?.isAdminLevel && !req.user?.currentRole?.isTeacher) {
        throw new Error('You are not authorized to import students')
      }
      const createdStudents: Student[] = []
      const updatedStudents: Student[] = []
      const formData = await req.formData?.()
      let errors: Record<string, string>[] = []
      if (formData?.get('file') instanceof File) {
        const json = await parseExcelToJson<ParentStudentExcel>(formData.get('file') as File)
        const {
          docs: [pRole],
        } = await req.payload.find({
          collection: 'roles',
          where: {
            isParent: {
              equals: true,
            },
          },
        })
        parentRole = pRole || null
        if (!parentRole) {
          throw new Error('Parent role not found')
        }
        const { docs: foundUsers } = await req.payload.find({
          collection: 'users',
          where: {
            email: {
              in: json.map((excelRow) => excelRow.メール),
            },
          },
        })
        const { docs: foundStudents } = await req.payload.find({
          collection: 'students',
          where: {
            parents: {
              in: foundUsers.map((user) => user.id),
            },
          },
        })

        const { docs: classrooms } = await req.payload?.find({
          collection: 'classrooms',
          locale: 'ja',
        })
        for (const excelRow of json) {
          try {
            const matchedStudent = foundStudents.find((student) => {
              return (
                (student.parents as User[]).some((parent) => parent.email === excelRow.メール) &&
                student.birthday === excelSerialToDate(excelRow.student_birthday).toISOString()
              )
            })
            /** found by email in excelRow */
            const studentsParent = foundUsers.find((user) => user.email === excelRow.メール)
            if (studentsParent) {
              /** the classroom to set to the student */
              const classroom = classrooms.find((classroom) => classroom.name === excelRow.クラス)
              if (!classroom) {
                throw new Error(`Classroom not found for student ${excelRow.クラス}`)
              }
              // await handleUpdateStudent({
              //   payload: req.payload,
              //   parent: studentsParent,
              //   classroom,
              //   locale: 'ja',
              //   excelRow: excelRow,
              // })
              continue
            }
            if (matchedStudent) {
              req.payload.logger.debug(
                `UPDATE LOGIC TO BE IMPLEMENTED
              Student ${excelRow.student_name_ja} ${excelRow.student_surname_ja} already exists.`,
              )
              continue
            }
            const newStudent = await handleCreateStudent({
              req,
              excelRow,
              studentsParent: studentsParent || null,
              classrooms,
            })
            createdStudents.push(newStudent)
          } catch (err) {
            console.log(err)
            // err might be an Error or something else
            const message = err instanceof Error ? err.message : String(err)
            // use excelRow.surname (or whatever identifies the excelRow)
            errors.push({
              [`${excelRow.student_name_ja} ${excelRow.student_surname_ja}`]: message,
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
    } catch (err) {
      req.payload.logger.error(err)
      return Response.json(
        {
          message: 'An error occurred',
        },
        { status: 500 },
      )
    }
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
    parents: [parent.id],
    classroom,
  }
  throw new Error('Not implemented')
}

async function handleCreateStudent({
  req,
  excelRow,
  classrooms,
  studentsParent,
}: {
  req: PayloadRequest
  excelRow: ParentStudentExcel
  classrooms: Classroom[]
  studentsParent: User | null
}) {
  if (!parentRole) {
    throw new Error('Parent role not found')
  }
  let foundParent = studentsParent
  if (!foundParent) {
    const newParent = await handleCreateUserFromStudentExcel({
      row: excelRow,
      payload: req.payload,
      parentRole: parentRole as Role,
    })
    foundParent = newParent
  }
  const newStudent = await req.payload.create({
    collection: 'students',
    locale: 'ja',
    context: {
      isAdminOperation: true,
    },
    data: handleTransformStudentExcel(excelRow, {
      locale: 'ja',
      parentId: foundParent.id,
      classrooms,
    }),
  })
  console.log('after create student')
  // createdStudents.push(newStudent)
  if (!newStudent.classroom) {
    throw new Error('Classroom not found')
  }
  let classroom: null | number = null

  if (newStudent.classroom) {
    if (typeof newStudent.classroom == 'number') {
      classroom = newStudent.classroom as number
    } else if (newStudent.classroom && 'id' in (newStudent.classroom as Classroom)) {
      classroom = (newStudent.classroom as Classroom).id
    }
    if (!classroom) {
      throw new Error('Classroom not found')
    }
  }

  if (!newStudent.parents) {
    throw new Error('Parent not found')
  }
  const parent = newStudent.parents.map((parent) => {
    if (typeof parent == 'number') {
      return parent
    }
    return parent.id
  })
  for (const locale of availableLocales.filter((locale) => locale !== 'ja')) {
    if (excelRow[`parent_name_${locale}`] && excelRow[`parent_surname_${locale}`]) {
      await req.payload.update({
        collection: 'students',
        id: newStudent.id,
        locale,
        context: {
          isAdminOperation: true,
        },
        data: {
          ...studentExcelToStudent(excelRow, {
            locale,
          }),
          classroom,
          parents: parent,
        },
      })
    }
  }
  return newStudent
}
