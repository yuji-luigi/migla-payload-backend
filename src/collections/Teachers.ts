import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Teachers: CollectionConfig = {
  slug: 'teachers',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
    },
    {
      name: 'classroom',
      type: 'relationship',
      relationTo: 'classrooms',
      hasMany: false,
    },
    ...slugField(),
  ],
  timestamps: true,
}
