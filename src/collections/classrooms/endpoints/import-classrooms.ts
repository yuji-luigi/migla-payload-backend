import { Endpoint, PayloadRequest } from 'payload'
import { ClassroomExcel } from '../types/classroom-excel'
import { parseExcelToJson, parseRequestToExcelJson } from '../../../lib/excel/parseExcelToJson'
import { Sailboat } from 'lucide-react'
import { ImportResult } from '../../../types/responses/importResponse'
import { Classroom } from '../../../payload-types'

export const importClassrooms: Omit<Endpoint, 'root'> = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
    // await new Promise((resolve) => setTimeout(resolve, 100000))
    const json = await parseRequestToExcelJson<ClassroomExcel>(req)
    const locales = ['ja', 'en', 'it'] as const
    const errors: Record<string, string>[] = []
    const created: Classroom[] = []
    const updated: Classroom[] = []
    const { docs: existingClassrooms } = await req.payload.find({
      collection: 'classrooms',
      locale: 'ja',
      depth: 0,
      where: {
        slug: { in: json.map((excelRow) => excelRow.slug) },
      },
      limit: 0,
    })

    console.log(json.map((excelRow) => excelRow.slug))

    req.payload.logger.info(existingClassrooms)
    const promises = json.map((excelRow, index) => async () => {
      try {
        console.log(excelRow.slug)
        const upClassroom = existingClassrooms.find(
          (existingClassroom) => existingClassroom.slug === excelRow.slug,
        )

        if (upClassroom) {
          for (const locale of locales) {
            if (!excelRow[`name_${locale}`]) {
              throw new Error(`Name in ${locale} is required`)
            }
            await req.payload.update({
              collection: 'classrooms',
              id: upClassroom.id,
              locale,
              data: {
                name: excelRow[`name_${locale}`],
                ord: excelRow.ord,
                slug: excelRow.slug,
              },
            })
          }
          updated.push(upClassroom)
        } else {
          const newClassroom = await req.payload.create({
            collection: 'classrooms',
            locale: 'ja',
            data: {
              name: excelRow.name_ja,
              ord: excelRow.ord,
              slug: excelRow.slug,
            },
          })
          created.push(newClassroom)
          for (const locale of locales) {
            if (!excelRow[`name_${locale}`]) {
              throw new Error(`Name in ${locale} is required`)
            }
            if (locale === 'ja') continue
            await req.payload.update({
              collection: 'classrooms',
              id: newClassroom.id,
              locale: locale,
              data: {
                name: excelRow[`name_${locale}`],
                slug: excelRow.slug,
                ord: excelRow.ord,
              },
            })
          }
        }
      } catch (error) {
        console.log(error)
        const deformedItem = excelRow as unknown as Record<string, string>
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
