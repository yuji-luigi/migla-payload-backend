import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const ReadNotification: CollectionConfig = {
  slug: 'read-notifications',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    hidden: ({ user }) => !user?.currentRole?.isSuperAdmin,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'notification',
      type: 'relationship',
      relationTo: 'notifications',
      required: true,
    },
  ],
  /**
   * Create a composite unique index on [user, notification]
   * so you can’t mark the same notification as read twice
   */
  indexes: [
    {
      fields: ['user', 'notification'],
      unique: true,
    },
  ],
  timestamps: true,
}
