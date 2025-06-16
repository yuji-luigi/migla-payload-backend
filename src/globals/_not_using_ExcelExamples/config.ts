import type { GlobalConfig } from 'payload'

import { revalidateLogoGlobal } from './hooks/revalidateLogoGlobal'
import { isAdmin } from '../../hooks/showOnlyAdmin'
import { LabelsT } from '../../types/my_types/labels'

export const LogoGlobal: GlobalConfig & {
  labels?: LabelsT
} = {
  slug: 'excelExample',
  labels: {
    singular: {
      ja: 'エクセルの例',
      en: 'Excel example',
      it: 'Esempio excel',
    },
    plural: {
      ja: 'エクセルの例',
      en: 'Excel examples',
      it: 'Esempi excel',
    },
  },
  admin: {
    hidden: ({ user }) => !isAdmin(user),
  },
  fields: [
    {
      name: 'user_example',
      type: 'upload',
      label: {
        ja: 'ユーザーの例',
        en: 'User example',
        it: 'Esempio utenti',
      },
      relationTo: 'media',
    },
    {
      name: 'logo_rectangle',
      type: 'upload',
      label: {
        ja: '長方形ロゴ',
        en: 'Rectangle Logo',
        it: 'Logo Rettangolo',
      },
      relationTo: 'media',
    },
    {
      name: 'logo_icon',
      type: 'upload',
      label: {
        ja: 'アイコンロゴ',
        en: 'Icon Logo',
        it: 'Logo Icona',
      },
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [revalidateLogoGlobal],
  },
}
