import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { isAboveAdmin } from '../../hooks/showOnlyAdmin'
import { LabelsT } from '../../types/my_types/labels'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig & {
  labels?: LabelsT
} = {
  slug: 'footer',
  labels: {
    singular: {
      ja: 'フッター',
      en: 'Footer',
      it: 'Footer',
    },
    plural: {
      ja: 'フッター',
      en: 'Footers',
      it: 'Footers',
    },
  },
  access: {
    read: ({ req }) => true,
    update: async ({ req }) => isAboveAdmin(req.user),
  },
  admin: {
    hidden: ({ user }) => {
      return !isAboveAdmin(user)
    },
  },
  fields: [
    {
      name: 'navItems',
      label: {
        ja: 'ナビゲーションアイテム',
        en: 'Navigation Items',
        it: 'Elementi di Navigazione',
      },
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/globals/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
