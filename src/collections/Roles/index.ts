import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { User } from '../../payload-types'
import { isAdmin } from '../../hooks/showOnlyAdmin'

export const Roles: CollectionConfig<'roles'> = {
  slug: 'roles',
  labels: {
    singular: {
      ja: 'ロール',
      en: 'Role',
    },
    plural: {
      ja: 'ロール',
      en: 'Roles',
    },
  },
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
    hidden: ({ user }) => {
      return !isAdmin(user as unknown as User)
    },
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
