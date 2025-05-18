import * as XLSX from 'xlsx'

export async function parseExcelToJson(file: File) {
  // load the file
  console.log(file)
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'binary' })
  // console.log(workbook)
  // pick the first sheet
  const sheet = workbook.Sheets
  // console.log(sheet)
  // convert to JSON (each row becomes an object keyed by the header row)
  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet)

  console.log(rows)
}
