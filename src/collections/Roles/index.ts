import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { User } from '../../payload-types'
import { isAdmin } from '../../hooks/showOnlyAdmin'
import { anyone } from '../../access/anyone'

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
    read: anyone,
    update: authenticated,
  },

  defaultPopulate: {
    // title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['slug', 'updatedAt'],
    useAsTitle: 'label',
    hidden: ({ user }) => {
      return !isAdmin(user as unknown as User)
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      localized: true,
      unique: true,
    },

    // TODO: set access control flags for section level to dynamically set access control flags for section level

    ...slugField('name'),
  ],

  timestamps: true,
}
