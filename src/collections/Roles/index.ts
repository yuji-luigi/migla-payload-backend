import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const Roles: CollectionConfig<'roles'> = {
  slug: 'roles',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  defaultPopulate: {
    // title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['slug', 'updatedAt'],
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    ...slugField('name'),
  ],

  timestamps: true,
}
