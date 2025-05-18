import * as XLSX from 'xlsx'

export function parseExcelToJson(file: File) {
  // load the file
  const workbook = XLSX.read(file)
  // pick the first sheet
  const sheet = workbook.Sheets
  // convert to JSON (each row becomes an object keyed by the header row)
  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet)

  console.log(rows)
}
