import { existingFileIcons } from './existing_file_icons'
// convert to excel string as extension
const excelFileExtensions = ['xlsx', 'xlsb', 'xltx', 'xls'] as const

const existingFileExtensions = ['excel', 'json', 'mov', 'csv', 'pdf', 'mp3', 'mp4'] as const

type FileExtensions = (typeof existingFileExtensions)[number] | (string & {})

const iconThemes = ['color', 'light', 'dark'] as const
type iconThemes = (typeof iconThemes)[number]
const fileIconDir = '/icons/file_icons'

export const getFileIconPath = (fileExtensionOriginal: FileExtensions, theme: iconThemes) => {
  let formattedFileExtension = fileExtensionOriginal.toLowerCase()
  formattedFileExtension = excelFileExtensions.includes(
    formattedFileExtension as (typeof excelFileExtensions)[number],
  )
    ? 'excel'
    : formattedFileExtension
  if (
    existingFileExtensions.includes(
      formattedFileExtension as (typeof existingFileExtensions)[number],
    )
  ) {
    const filePath = `${fileIconDir}/${formattedFileExtension}_${theme}.svg`
    if (existingFileIcons.includes(filePath as (typeof existingFileIcons)[number])) {
      console.error('fjask')
      return filePath
    }

    // NOTE: Did not want to recursively call the function here, so I just do for loop
    const restThemes = iconThemes.filter((iconTheme) => iconTheme !== theme)
    for (const restTheme of restThemes) {
      const restFilePath = `${formattedFileExtension}_${restTheme}.svg`
      if (existingFileIcons.includes(restFilePath as (typeof existingFileIcons)[number])) {
        return `${fileIconDir}/${restFilePath}`
      }
    }
  }

  return null
}

export const fileIconMap = [
  '/icons/excel_color.svg',
  '/icons/excel_light.svg',
  '/icons/excel_dark.svg',
  '/icons/image_light.svg',
  '/icons/json_light.svg',
  '/icons/json_dark.svg',
  '/icons/mov_color.svg',
  '/icons/mov_dark.svg',
  '/icons/mov_light.svg',
  '/icons/mp3_color.svg',
  '/icons/mp4_color.svg',
  '/icons/pdf_light.svg',
  '/icons/pdf_dark.svg',
] as const
