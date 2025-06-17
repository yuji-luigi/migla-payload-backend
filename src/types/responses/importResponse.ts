export type ImportResult<Doc> = {
  updated: Doc[]
  created: Doc[]
  errors: Record<string, string>[]
  message?: string
}
