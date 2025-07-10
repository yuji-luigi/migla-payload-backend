import { Endpoint, getPayload, Payload, PayloadRequest } from 'payload'
import { parseExcelToJson, parseRequestToExcelJson } from '../../../lib/excel/parseExcelToJson'
import { Classroom, Role, Student, User } from '../../../payload-types'
import { ParentStudentExcel } from '../../classrooms/types/parent-student-excel'
import { AvailableLocale, availableLocales } from '../../../lib/i18n/i18n_configs'
import {
  handleTransformStudentExcel,
  studentExcelToStudent,
} from '../dto/parentStutentExcelToStudent'
import { excelSerialToDate } from '../../../utilities/excelSerialToDate'
import { handleCreateUserFromStudentExcel } from '../helper/handleCreateUserFromStudentExcel'
import { match } from 'assert'
import { handleUpdateParentUser, studentParentExcelToUser } from '../dto/studentParentExcelToUser'

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
      const updatedStudents: any[] = []
      const json = await parseRequestToExcelJson<ParentStudentExcel>(req)
      const errors: Record<string, string>[] = []
      if (json.length > 0) {
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
          depth: 1,
          where: {
            parents: {
              in: foundUsers.map((user) => user.id),
            },
          },
          populate: {
            users: {
              email: true,
            },
            classrooms: { name: true },
          },
        })
        // console.dir(foundStudents, { depth: null })
        // throw new Error('stop')
        const { docs: classrooms } = await req.payload?.find({
          collection: 'classrooms',
          locale: 'ja',
        })
        for (const excelRow of json) {
          try {
            const matchedStudent = findMatchedStudent({ excelRow, foundStudents })
            /** found by email in excelRow */
            const foundStudentParent = foundUsers.find((user) => user.email === excelRow.メール)
            const classroom = classrooms.find((classroom) => classroom.name === excelRow.クラス)
            if (foundStudentParent && classroom) {
              // update the user (parent) that is found by email
              await handleUpdateParentUser({ payload: req.payload, foundStudentParent, excelRow })
            }
            if (matchedStudent) {
              const { updated } = await handleUpdateStudent({
                foundStudentParent,
                excelRow,
                req,
                matchedStudent,
              })
              updatedStudents.push(updated)
              continue
            }
            /** create student. if parent exists, parent is not touched here. */
            const newStudent = await handleCreateParentAndStudent({
              req,
              excelRow,
              foundStudentParent,
              classrooms,
            })
            createdStudents.push(newStudent)
          } catch (err: any) {
            // err might be an Error or something else
            const message = err instanceof Error ? err.message : String(err)
            console.dir(err, { depth: null })
            // use excelRow.surname (or whatever identifies the excelRow)
            errors.push({
              row: excelRow.メール,
              collection: err.data.collection,
              message,
              [`${excelRow.student_name_ja} ${excelRow.student_surname_ja}`]: message,
            })
          }
        }
      }

      return Response.json(
        {
          updated: updatedStudents,
          created: createdStudents,
          errors,
          message: errors.length > 0 ? 'Some errors occurred' : 'Success!',
        },
        {
          status:
            createdStudents.length > 0 || updatedStudents.length > 0
              ? 200
              : errors.length > 0
                ? 400
                : 200,
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

async function handleCreateParentAndStudent({
  req,
  excelRow,
  classrooms,
  foundStudentParent,
}: {
  req: PayloadRequest
  excelRow: ParentStudentExcel
  classrooms: Classroom[]
  foundStudentParent: User | null | undefined
}) {
  if (!parentRole) {
    throw new Error('Parent role not found')
  }
  if (!foundStudentParent) {
    const newParent = await handleCreateUserFromStudentExcel({
      row: excelRow,
      payload: req.payload,
      parentRole: parentRole as Role,
    })
    foundStudentParent = newParent
  }
  const newStudent = await req.payload.create({
    collection: 'students',
    locale: 'ja',
    // context: {
    //   isAdminOperation: true,
    // },
    req,
    data: handleTransformStudentExcel(excelRow, {
      locale: 'ja',
      parentId: foundStudentParent.id,
      classrooms,
    }),
  })

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

const findMatchedStudent = ({
  excelRow,
  foundStudents,
}: {
  excelRow: ParentStudentExcel
  foundStudents: Student[]
}) =>
  foundStudents.find((student) => {
    return (
      (student.parents as User[]).some((parent) => parent.email === excelRow.メール) &&
      student.birthday === excelSerialToDate(excelRow.student_birthday).toISOString()
    )
  })

async function handleUpdateStudent({
  foundStudentParent,
  excelRow,
  req,
  matchedStudent,
}: {
  foundStudentParent: User | null | undefined
  excelRow: ParentStudentExcel
  req: PayloadRequest
  matchedStudent: Student
}) {
  let settingParentId = [foundStudentParent?.id]
  let updatedStudent = {}
  if (!foundStudentParent) {
    const newParent = await handleCreateUserFromStudentExcel({
      row: excelRow,
      payload: req.payload,
      parentRole: parentRole as Role,
    })
    settingParentId = [newParent.id]
  }
  const studentParentsIDs = matchedStudent.parents.map((parent) => {
    if (typeof parent == 'number') {
      return parent
    }
    return parent.id
  })
  // student.parents are not updated fully. it is only added. so if excel changes the parent the new parent is added to existing array only removing the duplicates
  for (const locale of availableLocales) {
    if (excelRow[`student_name_${locale}`] && excelRow[`student_surname_${locale}`]) {
      await req.payload.update({
        collection: 'students',
        id: matchedStudent.id,
        locale,
        data: {
          ...studentExcelToStudent(excelRow, { locale }),
          parents: [...new Set([...studentParentsIDs, ...settingParentId])],
        },
        req,
      })
      updatedStudent = {
        ...updatedStudent,
        ...studentExcelToStudent(excelRow, { locale }),
        id: matchedStudent.id,
      }
    }
  }
  return { updated: updatedStudent }
}
