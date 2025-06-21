import { AvailableLocale } from '../../../lib/i18n/i18n_configs'
import { Classroom, Student, User } from '../../../payload-types'
import { ParentStudentExcel } from '../../classrooms/types/parent-student-excel'

/** @description it handles because accepts existing users and classrooms and find the correct document then set the correct data return it as dto
 */
export function handleTransformStudentExcel(
  parentStudentExcel: ParentStudentExcel,
  {
    locale = 'ja',
    parents,
    classrooms,
  }: { locale: AvailableLocale; parents: User[]; classrooms: Classroom[] },
): Omit<Student, 'id' | 'updatedAt' | 'createdAt'> {
  const parent = parents.find((parent) => parent.email === parentStudentExcel.メール)
  const classroom = classrooms.find((classroom) => classroom.name === parentStudentExcel.クラス)
  if (!parent || !classroom) {
    throw new Error('Parent or classroom not found')
  }
  return {
    name: parentStudentExcel[`student_name_${locale}`] || '',
    surname: parentStudentExcel[`student_surname_${locale}`] || '',
    classroom: classroom.id,
    parent: [parent.id],
  }
}

/** @description it just transform by locale */
export function studentExcelToStudent(
  parentStudentExcel: ParentStudentExcel,
  {
    locale = 'ja',
  }: {
    locale: AvailableLocale
  },
): Omit<Student, 'id' | 'updatedAt' | 'createdAt' | 'classroom' | 'parent'> {
  return {
    name: parentStudentExcel[`student_name_${locale}`] || '',
    surname: parentStudentExcel[`student_surname_${locale}`] || '',
  }
}
