import type { GlobalConfig } from 'payload'

import { revalidateLogoGlobal } from './hooks/revalidateLogoGlobal'
import { isAdmin, isSuperAdmin } from '../../hooks/showOnlyAdmin'
import { LabelsT } from '../../types/my_types/labels'

export const LogoGlobal: GlobalConfig & {
  labels?: LabelsT
} = {
  slug: 'logoGlobal',
  labels: {
    singular: {
      ja: 'ロゴ',
      en: 'Logo',
      it: 'Logo',
    },
    plural: {
      ja: 'ロゴ',
      en: 'Logos',
      it: 'Loghi',
    },
  },
  admin: {
    hidden: ({ user }) => !isAdmin(user) && !isSuperAdmin(user),
  },
  fields: [
    {
      name: 'logo_square',
      type: 'upload',
      label: {
        ja: '正方形ロゴ',
        en: 'Square Logo',
        it: 'Logo Quadrato',
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
