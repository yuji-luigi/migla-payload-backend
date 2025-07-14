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
    read: anyone,
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
      // Virtual flag, only in the Admin/GraphQL, never persisted
      name: 'isRead',
      type: 'checkbox',
      virtual: true,

      // graphQL: { read: true },    // ensure it shows up in the schema
      admin: { hidden: true }, // hide from the UI form
      hooks: {
        afterRead: [
          async ({ originalDoc, req, operation, findMany, context }) => {
            if (req.user?.currentRole?.isParent && !findMany) {
              console.log('create read notification')
              await req.payload
                .create({
                  collection: 'read-notifications',
                  data: {
                    user: req.user!.id,
                    notification: originalDoc.id,
                  },
                })
                .catch((error) => {})
            }
            console.log({ operation, findMany })
            // return false
            // originalDoc.readBy came back populated by the REST find

            if (req.user?.currentRole?.isParent) {
              context.stop = true
              const paginatedReadNotifications = await req.payload.find({
                collection: 'read-notifications',
                where: {
                  user: {
                    equals: req.user!.id,
                  },
                  notification: {
                    equals: originalDoc.id,
                  },
                },
              })
              const isRead = paginatedReadNotifications.docs.length > 0

              return isRead
            }
          },
        ],
      },
    },
  ],

  timestamps: true,
}
