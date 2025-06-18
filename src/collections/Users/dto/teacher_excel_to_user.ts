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
  return {
    password: row.password,
    roles: [roleTeacher.id],
    // id: 0,
    name: row[`name_${locale}`],
    surname: row[`surname_${locale}`],
    email: row.email,
    // updatedAt: new Date().toISOString(),
    // createdAt: new Date().toISOString(),
  }
}
