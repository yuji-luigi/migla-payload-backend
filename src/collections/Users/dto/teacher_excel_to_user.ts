import { Locale } from 'payload'
import { Role, User } from '../../../payload-types'
import { TeacherExcel } from '../../classrooms/types/teacher-excel'

export function teacherExcelToUser({
  row,
  locale,
  roleTeacher,
}: {
  row: TeacherExcel
  locale: 'ja' | 'en' | 'it'
  roleTeacher: Role & { isTeacher: true }
}): Omit<User, 'id' | 'updatedAt' | 'createdAt'> {
  console.log(row[`name_${locale}`])
  if (!row[`name_${locale}`]) {
    throw new Error(`Name ${locale} is required`)
  }
  if (!row[`surname_${locale}`]) {
    throw new Error(`Surname ${locale} is required`)
  }
  if (!row.email) {
    throw new Error(`Email is required`)
  }

  return {
    password: row.password,
    roles: [roleTeacher.id],
    name: row[`name_${locale}`],
    surname: row[`surname_${locale}`]!,
    email: row.email,
  }
}
