import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { User } from '../payload-types'
import { isAdmin } from '../hooks/showOnlyAdmin'

export const Settings: CollectionConfig = {
  slug: 'settings',
  labels: {
    singular: {
      ja: '設定',
      en: 'Setting',
      it: 'Impostazione',
    },
    plural: {
      ja: '設定',
      en: 'Settings',
      it: 'Impostazioni',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'locale',
    hidden: ({ user }) => {
      return !isAdmin(user as unknown as User)
    },
  },
  fields: [
    {
      name: 'locale',
      type: 'select',
      label: {
        ja: '言語',
        en: 'Language',
        it: 'Lingua',
      },
      required: true,
      options: ['en', 'ja', 'it'],
    },
    {
      name: 'user',
      label: {
        ja: 'ユーザー',
        en: 'User',
        it: 'Utente',
      },
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
    },
  ],
  timestamps: true,
}
