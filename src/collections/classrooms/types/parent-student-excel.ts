export type ParentStudentExcel = {
  parent_surname_ja: string
  parent_surname_en: string | null
  parent_surname_it: string | null

  parent_name_ja: string
  parent_name_en: string | null
  parent_name_it: string | null

  slug: string

  student_surname_ja: string
  student_surname_en: string | null
  student_surname_it: string | null

  student_name_ja: string
  student_name_en: string | null
  student_name_it: string | null

  student_slug: string

  メール: string
  電話番号: string
  役割: string
  クラス: string
  パスワード: string
}
