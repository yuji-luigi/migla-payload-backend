import { Endpoint } from 'payload'
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
      const notFoundRoles = distRoles.filter(
        (role) => !parentRoles.docs.some((r) => r.slug === role),
      )

      const { dto, errors } = ExcelToUser({
        excelRows: json,
        rolesDb: parentRoles.docs,
      })

      const promises = dto.filter(Boolean).map((user) => {
        if (!user) return
        return req.payload.create({
          collection: 'students',
          data: user as unknown as Student,
        })
      })
      await Promise.all(promises)
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
}

function ExcelToUser({ excelRows, rolesDb }: { excelRows: UserExcel[]; rolesDb: Role[] }) {
  const errors: Record<string, string> = {}

  const dto = excelRows.map((user) => {
    const role = rolesDb.filter((role) =>
      user.役割
        .toLowerCase()
        .split(',')
        .some((roleInExcel) => roleInExcel === role.slug?.toLowerCase()),
    )
    if (!role) {
      errors[user.メール] = `役割が見つかりません: ${user.役割}`
      return null
    }
    if (role.some((r) => r.isParent)) {
      // errors[user.メール] = `保護者はインポートできません: ${user.役割}`
      // return null
    }
    if (role.some((r) => r.isTeacher)) {
      // TODO: do this after the user is created
      console.log(
        'teacher found need to create the teacher table with this user after creation of the user.',
      )
    }
    return {
      surname: user.姓,
      name: user.名,
      email: user.メール,
      phone: user.電話番号,
      roles: role.map((r) => r.id),
    }
  })

  return {
    dto: dto,
    errors,
  }
}
// function ExcelToStudent(json: )
