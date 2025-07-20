import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
import { isAdmin, isSuperAdmin } from '../../hooks/showOnlyAdmin'
import { User } from '../../payload-types'
import { link } from '../../fields/link'
import { linkGroup } from '../../fields/linkGroup'
import { notificationHooks } from './hooks/notificationHooks'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  labels: {
    singular: {
      ja: '通知',
      en: 'Notification',
      it: 'Notifica',
    },
    plural: {
      ja: '通知',
      en: 'Notifications',
      it: 'Notifiche',
    },
  },

  hooks: notificationHooks,
  // only admins
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    hidden: ({ user }) => {
      return !isAdmin(user) && !isSuperAdmin(user)
    },
  },
  fields: [
    {
      name: 'title',
      label: {
        ja: 'タイトル',
        en: 'Title',
        it: 'Titolo',
      },
      localized: true,
      index: true,
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      label: {
        ja: '本文',
        en: 'Body',
        it: 'Corpo',
      },
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
      label: {
        ja: 'タイプ',
        en: 'Type',
        it: 'Tipo',
      },
      type: 'select',
      required: true,
      // options: ['payment', 'general_notification', 'event'],
      options: [
        { label: 'Payment', value: 'payment' },
        { label: 'General Notification', value: 'general_notification' },
        { label: 'Event', value: 'event' },
      ],
    },
    {
      name: 'attachments',
      label: {
        ja: '添付ファイル',
        en: 'Attachments',
        it: 'Allegati',
      },
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    linkGroup({
      overrides: {
        localized: true,
      },
    }), // TODO: CREATE CUSTOM COMPONENT TO SHOW ONLY TO SUPER_ADMIN
    {
      name: 'students',
      label: {
        ja: '通知対象者(学生)',
        en: 'Notification Target (Students)',
        it: 'Destinatari Notifiche (Studenti)',
      },
      type: 'relationship',
      relationTo: 'students',
      hasMany: true,
      hidden: true,
    },
    {
      name: 'hasAttachments',
      virtual: true,
      type: 'checkbox',
      admin: {
        hidden: true,
      },

      hooks: {
        afterRead: [
          ({ originalDoc }) => {
            return originalDoc.attachments.length > 0
          },
        ],
      },
    },
    {
      name: 'readRecords',
      type: 'join',
      collection: 'read-notifications',
      on: 'notification',
      admin: {
        hidden: true,
      },
      maxDepth: 0,
    },

    {
      // Virtual flag, only in the Admin/GraphQL, never persisted
      name: 'isRead',
      type: 'checkbox',
      virtual: true,

      // graphQL: { read: true },    // ensure it shows up in the schema
      admin: { hidden: true }, // hide from the UI form
      hooks: {
        afterRead: [
          async ({ originalDoc, req, operation, findMany, context }) => {
            const isRead = originalDoc.readRecords.docs?.length > 0
            return isRead
          },
        ],
      },
    },
  ],

  timestamps: true,
}
