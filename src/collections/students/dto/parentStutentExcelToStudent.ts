import { AvailableLocale } from '../../../lib/i18n/i18n_configs'
import { Classroom, Student, User } from '../../../payload-types'
import { excelSerialToDate } from '../../../utilities/excelSerialToDate'
import { ParentStudentExcel } from '../../classrooms/types/parent-student-excel'

/** @description it handles because accepts existing users and classrooms and find the correct document then set the correct data return it as dto
 */
export function handleTransformStudentExcel(
  parentStudentExcel: ParentStudentExcel,
  {
    locale = 'ja',
    parentId,
    classrooms,
  }: { locale: AvailableLocale; parentId: number; classrooms: Classroom[] },
): Omit<Student, 'id' | 'updatedAt' | 'createdAt'> {
  const classroom = classrooms.find((classroom) => classroom.name === parentStudentExcel.クラス)
  if (!classroom) {
    throw new Error(`classroom not found ${parentStudentExcel.メール} ${parentStudentExcel.クラス}`)
  }
  return {
    name: parentStudentExcel[`student_name_${locale}`] || '',
    surname: parentStudentExcel[`student_surname_${locale}`] || '',
    classroom: classroom.id,
    parent: parentId,
    birthday: excelSerialToDate(parentStudentExcel.student_birthday).toDateString(),
    slug: parentStudentExcel.student_slug,
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
    birthday: excelSerialToDate(parentStudentExcel.student_birthday).toDateString(),
    slug: parentStudentExcel.student_slug,
  }
}
