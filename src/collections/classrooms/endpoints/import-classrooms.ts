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
    const json = await parseRequestToExcelJson<ClassroomExcel>(req)
    const locales = ['ja', 'en', 'it'] as const
    const errors: Record<string, string>[] = []
    const created: Classroom[] = []
    const updated: Classroom[] = []
    const promises = json.map((item, index) => async () => {
      try {
        const paginatedClassrooms = await req.payload.find({
          collection: 'classrooms',
          locale: 'ja',
          where: {
            name: { equals: item.name_ja },
          },
          limit: 1,
        })
        console.log(paginatedClassrooms)
        if (paginatedClassrooms.docs.length > 0 && paginatedClassrooms.docs[0]?.id) {
          updated.push(paginatedClassrooms.docs[0])
          for (const locale of locales) {
            if (!item[`name_${locale}`]) {
              throw new Error(`Name in ${locale} is required`)
            }
            req.payload.update({
              collection: 'classrooms',
              id: paginatedClassrooms.docs[0].id,
              locale,
              data: {
                name: item[`name_${locale}`],
                ord: item.ord,
                slug: item.slug,
              },
            })
          }
        } else {
          const newClassroom = await req.payload.create({
            collection: 'classrooms',
            locale: 'ja',
            data: {
              name: item.name_ja,
              ord: item.ord,
              slug: item.slug,
            },
          })
          created.push(newClassroom)
          for (const locale of locales) {
            if (!item[`name_${locale}`]) {
              throw new Error(`Name in ${locale} is required`)
            }
            if (locale === 'ja') continue
            await req.payload.update({
              collection: 'classrooms',
              id: newClassroom.id,
              locale: locale,
              data: {
                name: item[`name_${locale}`],
                slug: item.slug,
                ord: item.ord,
              },
            })
          }
        }
      } catch (error) {
        console.log('jspaioj')
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
