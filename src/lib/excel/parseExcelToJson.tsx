import * as XLSX from 'xlsx'
import { notEmpty } from '../notEmpty'
import { PayloadRequest } from 'payload'

export async function parseExcelToJson<ResultJsonType>(file: File): Promise<ResultJsonType[]> {
  // load the file
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'binary' })
  const sheetNames = workbook.SheetNames

  return sheetNames
    .flatMap((sheetName) => {
      const sheet = workbook.Sheets[sheetName]
      if (!sheet) return null
      const rows: ResultJsonType[] = XLSX.utils.sheet_to_json(sheet) as ResultJsonType[]
      return rows
    })
    .filter<ResultJsonType>(notEmpty)
}

export async function parseRequestToExcelJson<ResultJsonType>(
  req: PayloadRequest,
): Promise<ResultJsonType[]> {
  const formData = await req.formData?.()
  if (formData?.get('file') instanceof File) {
    const json = await parseExcelToJson<ResultJsonType>(formData.get('file') as File)
    return json
  }
  return []
}
