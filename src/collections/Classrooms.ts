import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { isAdmin } from '../hooks/showOnlyAdmin'
import { User } from '../payload-types'

export const Classrooms: CollectionConfig = {
  slug: 'classrooms',
  labels: {
    singular: {
      ja: 'クラス',
      en: 'Class',
      it: 'Classe',
    },
    plural: {
      ja: 'クラス',
      en: 'Classes',
      it: 'Classi',
    },
  },
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
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    ...slugField(),
  ],
  timestamps: true,
}
