import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
import { isAdmin, isSuperAdmin } from '../../hooks/showOnlyAdmin'
import { User } from '../../payload-types'
import { link } from '../../fields/link'
import { linkGroup } from '../../fields/linkGroup'
import { notificationHooks } from '../paymentSchedules/hooks/notificationHooks'

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
        { label: 'Teacher Report', value: 'teacher_report' },
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
    {
      name: 'imageUrl',
      label: {
        ja: '画像URL',
        en: 'Image URL',
        it: 'URL Immagine',
      },
      type: 'text',
    },
    {
      name: 'collection',
      label: {
        ja: 'コレクション',
        en: 'Collection',
        it: 'Collezione',
      },
      type: 'text',
    },
    {
      name: 'data',
      label: {
        ja: 'データ',
        en: 'Data',
        it: 'Dati',
      },
      type: 'json',
      validate: (val) => {
        // enforce "string→string" if you like
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
      name: 'users',
      label: {
        ja: '通知対象者(ユーザー)',
        en: 'Notification Target (Users)',
        it: 'Destinatari Notifiche (Utenti)',
      },
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'isModifiedNotification',
      label: {
        ja: '修正された通知',
        en: 'Modified Notification',
        it: 'Notifica Modificata',
      },
      type: 'checkbox',
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
      virtual: true,
      admin: {
        hidden: true,
      },
      maxDepth: 0,
    },

    // {
    //   // Virtual flag, only in the Admin/GraphQL, never persisted
    //   name: 'isRead',
    //   type: 'checkbox',
    //   virtual: true,

    //   // graphQL: { read: true },    // ensure it shows up in the schema
    //   admin: { hidden: true }, // hide from the UI form
    //   hooks: {
    //     afterRead: [
    //       async ({ originalDoc, req, operation, findMany, context }) => {
    //         const isRead = Boolean(originalDoc.readRecords?.docs?.length > 0)
    //         return isRead
    //       },
    //     ],
    //   },
    // },
  ],

  timestamps: true,
}
