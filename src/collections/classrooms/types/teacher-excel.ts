export interface TeacherExcel {
  /** User's full name in Japanese */
  name_ja: string
  /** User's full name in Italian */
  name_it: string
  /** User's full name in English */
  name_en: string

  /** User's surname in Japanese */
  surname_ja: string
  /** User's surname in English */
  surname_en: string
  /** User's surname in Italian */
  surname_it: string

  /** Contact email */
  email: string
  /** Account password (hashed) */
  password: string

  /** Teacher's name in Japanese */
  teacher_name_ja: string
  /** Teacher's name in English */
  teacher_name_en: string
  /** Teacher's name in Italian */
  teacher_name_it: string

  /** Classroom name in Japanese */
  classroom_ja: string
}
