import * as XLSX from 'xlsx'

export async function parseExcelToJson(file: File) {
  // load the file
  console.log(file)
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'binary' })
  const sheetNames = workbook.SheetNames

  return sheetNames.flatMap((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) return null
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet)
    return rows
  })
}
