import { Payload } from 'payload'
import { AvailableLocale, availableLocales } from '../../../lib/i18n/i18n_configs'
import { ParentStudentExcel } from '../../classrooms/types/parent-student-excel'
import { User } from '../../../payload-types'

/**
 * create user(parent) from student excel row
 * role must be set from outside
 * */
export function studentParentExcelToUser(
  excelRow: ParentStudentExcel,
  {
    locale,
    updatingUser,
  }: {
    locale: AvailableLocale
    updatingUser?: User
  },
) {
  return {
    email: excelRow.メール,
    name: excelRow[`parent_name_${locale}`] || updatingUser?.name,
    surname: excelRow[`parent_surname_${locale}`] || updatingUser?.surname,
  }
}

export async function handleUpdateParentUser({
  payload,
  foundStudentParent,
  excelRow,
}: {
  payload: Payload
  foundStudentParent: User
  excelRow: ParentStudentExcel
}) {
  for (const locale of availableLocales) {
    await payload
      .update({
        collection: 'users',
        id: foundStudentParent.id,
        locale,
        data: studentParentExcelToUser(excelRow, { locale, updatingUser: foundStudentParent }),
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
