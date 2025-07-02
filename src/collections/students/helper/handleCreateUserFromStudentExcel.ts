import { Payload, PayloadRequest } from 'payload'
import { ParentStudentExcel } from '../../classrooms/types/parent-student-excel'
import { Role } from '../../../payload-types'
import { availableLocales } from '../../../lib/i18n/i18n_configs'

export async function handleCreateUserFromStudentExcel({
  row,
  payload,

  parentRole,
}: {
  row: ParentStudentExcel
  payload: Payload
  parentRole: Role
}) {
  /** in the same import the user was already created (in case students has the same parent) */
  const {
    docs: [createdUser],
  } = await payload.find({
    collection: 'users',
    locale: 'ja',
    where: {
      email: {
        equals: row.メール,
      },
    },
  })
  if (createdUser) {
    return createdUser
  }
  const newUser = await payload.create({
    collection: 'users',
    locale: 'ja',
    data: {
      email: row.メール,
      name: row.parent_name_ja,
      surname: row.parent_surname_ja,
      roles: [(parentRole as Role).id],
      password: row.パスワード,
    },
  })
  const restLocales = availableLocales.filter((locale) => locale !== 'ja')
  for (const locale of restLocales) {
    if (row[`parent_name_${locale}`] && row[`parent_surname_${locale}`]) {
      await payload.update({
        collection: 'users',
        id: newUser.id,
        locale: locale,
        data: {
          name: row[`parent_name_${locale}`] || '',
          surname: row[`parent_surname_${locale}`] || '',
        },
      })
    }
  }
  return newUser
}
