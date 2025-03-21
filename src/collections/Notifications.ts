import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  // only admins
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
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
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    // TODO: CREATE CUSTOM COMPONENT TO SHOW ONLY TO SUPER_ADMIN
    {
      name: 'students',
      type: 'relationship',
      relationTo: 'students',
      hasMany: true,
      hidden: true,
    },
  ],
  timestamps: true,
}
