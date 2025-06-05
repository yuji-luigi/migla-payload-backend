import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { isAdmin } from '../hooks/showOnlyAdmin'
import { User } from '../payload-types'
import { link } from '../fields/link'

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
      return !isAdmin(user as unknown as User)
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
    link(),
    // TODO: CREATE CUSTOM COMPONENT TO SHOW ONLY TO SUPER_ADMIN
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
  ],
  timestamps: true,
}
