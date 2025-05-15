import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { isAdmin } from '../hooks/showOnlyAdmin'
import { User } from '../payload-types'

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
    hidden: ({ user }) => {
      return !isAdmin(user as unknown as User)
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      // maxDepth: 0,
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
