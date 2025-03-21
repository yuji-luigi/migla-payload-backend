import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

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
