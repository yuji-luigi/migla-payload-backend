import type { GlobalConfig, LabelFunction, StaticLabel } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { isAdmin } from '../../hooks/showOnlyAdmin'
import { LabelsT } from '../../types/my_types/labels'

export const Header: GlobalConfig & {
  labels?: LabelsT
} = {
  slug: 'header',
  labels: {
    singular: {
      ja: 'ヘッダー',
      en: 'Header',
      it: 'Header',
    },
    plural: {
      ja: 'ヘッダー',
      en: 'Headers',
      it: 'Headers',
    },
  },
  access: {
    read: ({ req }) => {
      return isAdmin(req.user)
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
          RowLabel: '@/globals/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
