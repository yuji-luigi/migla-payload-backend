import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const ReadReport: CollectionConfig = {
  slug: 'read-reports',
  labels: {
    singular: {
      ja: '既読レポート',
      en: 'Read Report',
      it: 'Report letto',
    },
    plural: {
      ja: '既読レポート',
      en: 'Read Reports',
      it: 'Report letti',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req: { user } }) => {
      if (user?.currentRole?.isSuperAdmin) {
        return true
      }
      return {
        user: {
          equals: user?.id,
        },
      }
    },
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
      name: 'report',
      type: 'relationship',
      relationTo: 'reports',
      required: true,
    },
  ],
  /**
   * Create a composite unique index on [user, notification]
   * so you can’t mark the same notification as read twice
   */
  indexes: [
    {
      fields: ['user', 'report'],
      unique: true,
    },
  ],
  timestamps: true,
}
