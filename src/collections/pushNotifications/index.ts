import { equal } from 'assert'
import { APIError, logError, Where, type CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import {
  isAboveAdmin,
  isAboveAdminAccess,
  isAdmin,
  isSuperAdmin,
  isSuperAdminAccess,
} from '../../hooks/showOnlyAdmin'
import { errorMessages } from '../../lib/error_messages'
import { Role, User } from '../../payload-types'

export const PushNotifications: CollectionConfig = {
  slug: 'push-notifications',
  labels: {
    singular: {
      ja: 'プッシュ通知',
      en: 'Push Notification',
      it: 'Notifica Push',
    },
    plural: {
      ja: 'プッシュ通知',
      en: 'Push Notifications',
      it: 'Notifiche Push',
    },
  },
  access: {
    admin: isSuperAdminAccess,
    create: () => true,
    read: ({ req: { user } }) => {
      if (user?.currentRole?.isSuperAdmin) {
        return true
      }
      return {
        users: {
          equals: user?.id,
        },
      }
    },
    update: isAboveAdminAccess,
    delete: isAboveAdminAccess,
  },

  fields: [
    { name: 'title', type: 'text' },
    { name: 'body', type: 'text' },
    { name: 'type', type: 'text' },
    { name: 'collection', type: 'text' },
    {
      name: 'data',
      type: 'json',
      required: true,
      defaultValue: {}, // you can default to an empty object
      validate: (val) => {
        // enforce “string→string” if you like
        if (
          typeof val === 'object' &&
          val !== null &&
          Object.values(val).every((v) => typeof v === 'string')
        )
          return true
        return 'Must be an object of string→string'
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
    },
    {
      name: 'users',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: true,
    },
    {
      name: 'isModifiedNotification',
      type: 'checkbox',
    },
  ],
  timestamps: true,
}
