import { Endpoint } from 'payload'
import { parseExcelToJson } from '../../../lib/excel/parseExcelToJson'
import { Classroom, Student, User } from '../../../payload-types'

export const importUsers: Omit<Endpoint, 'root'> = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
    const formData = await req.formData?.()

    if (formData?.get('file') instanceof File) {
      const json = (await parseExcelToJson(formData.get('file') as File)) as StudentExcel[]
      console.log(json)
      const parentRoles = await req.payload.find({
        collection: 'roles',
        where: {
          isParent: {
            equals: true,
          },
        },
      })
      const paginatedParents = await req.payload?.find({
        collection: 'users',
        where: {
          roles: {
            in: parentRoles.docs.map((role) => role.id),
          },
        },
      })
      const paginatedClassrooms = await req.payload?.find({
        collection: 'classrooms',
      })

      const { dto, errors } = ExcelToStudent({
        json,
        parents: paginatedParents.docs,
        classrooms: paginatedClassrooms.docs,
      })
      const promises = dto.filter(Boolean).map((student) => {
        if (!student) return
        return req.payload.create({
          collection: 'students',
          data: student as unknown as Student,
        })
      })
      await Promise.all(promises)
    }

    return Response.json({
      message: `Hello ${req.routeParams?.name as string} @ ${req.routeParams?.group as string}`,
    })
  },
}

type StudentExcel = {
  メール: string
  名: string
  姓: string
  役割: string
  電話番号: number
}

function ExcelToStudent({
  json,
  parents,
  classrooms,
}: {
  json: StudentExcel[]
  parents: User[]
  classrooms: Classroom[]
}) {
  const errors: string[] = []
  const studentsDto = json.map((student) => {
    const parent = parents.find((parent) => parent.email === student.メール)
    const classroom = classrooms.find((classroom) => classroom.name === student.学年)
    if (!parent) {
      errors.push(`Parent not found for student ${student.メール}`)
      return null
    }
    if (!classroom) {
      errors.push(`Classroom not found for student ${student.学年}`)
      return null
    }
    return {
      surname: student.姓,
      name: student.名,
      guardianSurname: student.保護者姓,
      guardianName: student.保護者名,
      email: student.メール,
      phone: student.電話番号,
      grade: student.学年,
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
