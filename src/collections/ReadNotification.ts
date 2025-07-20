import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const ReadNotification: CollectionConfig = {
  slug: 'read-notifications',
  labels: {
    singular: {
      ja: '既読通知',
      en: 'Read Notification',
      it: 'Notifica letta',
    },
    plural: {
      ja: '既読通知',
      en: 'Read Notifications',
      it: 'Notifiche lette',
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
