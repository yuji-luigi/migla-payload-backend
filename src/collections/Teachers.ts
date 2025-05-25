import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { isAdmin } from '../hooks/showOnlyAdmin'
import { User } from '../payload-types'

export const Teachers: CollectionConfig = {
  labels: {
    singular: {
      ja: '先生',
      en: 'Teacher',
      it: 'Docente',
    },
    plural: {
      ja: '先生',
      en: 'Teachers',
      it: 'Docenti',
    },
  },
  slug: 'teachers',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => {
      return !isAdmin(user as unknown as User)
    },
  },
  fields: [
    {
      name: 'name',
      label: {
        ja: '名前',
        en: 'Name',
        it: 'Nome',
      },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'isAssistant',
      label: {
        ja: 'アシスタント',
        en: 'Assistant',
        it: 'Assistente',
      },
      type: 'checkbox',
      defaultValue: false,
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
      unique: true,
      // maxDepth: 0,
      hasMany: false,
    },
    {
      name: 'classroom',
      label: {
        ja: 'クラス',
        en: 'Classroom',
        it: 'Classe',
      },
      type: 'relationship',
      relationTo: 'classrooms',
      hasMany: false,
    },
    ...slugField('name'),
  ],
  timestamps: true,
}
