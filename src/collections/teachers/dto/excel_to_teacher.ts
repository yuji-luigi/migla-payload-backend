import { Teacher } from '../../../payload-types'
import { TeacherExcel } from '../../classrooms/types/teacher-excel'

export function teacherExcelToTeacher({
  row,
  locale,
  userId,
  classroomId,
}: {
  row: TeacherExcel
  userId: number
  locale: 'ja' | 'en' | 'it'
  classroomId: number | null
}): Omit<Teacher, 'id' | 'updatedAt' | 'createdAt'> {
  return {
    name: row[`teacher_name_${locale}`] || '',
    user: userId,
    isAssistant: false,
    classroom: classroomId,
  }
}
