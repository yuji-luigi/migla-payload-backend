import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { User } from '../payload-types'
import { isAdmin } from '../hooks/showOnlyAdmin'

export const Settings: CollectionConfig = {
  slug: 'settings',
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
      required: true,
      options: ['en', 'fr', 'es'],
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
    },
  ],
  timestamps: true,
}
