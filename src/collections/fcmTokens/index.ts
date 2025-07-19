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

export const FcmTokens: CollectionConfig = {
  slug: 'fcmTokens',
  labels: {
    singular: {
      ja: 'FCMトークン',
      en: 'FCM Token',
    },
    plural: {
      ja: 'FCMトークン',
      en: 'FCM Tokens',
    },
  },
  access: {
    admin: isSuperAdminAccess,
    create: () => true,
    read: () => true,
    update: isAboveAdminAccess,
    delete: isAboveAdminAccess,
  },

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
    },
    {
      name: 'token',
      type: 'text',
      unique: true,
    },

    {
      name: 'osName',
      type: 'text',
    },
    {
      name: 'osVersion',
      type: 'text',
    },
    // {
    //   name: 'deviceID',
    //   type: 'text',
    // }
  ],
  timestamps: true,
}
