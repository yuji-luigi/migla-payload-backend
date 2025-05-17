import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Homeworks: CollectionConfig = {
  slug: 'homeworks',
  labels: {
    singular: {
      ja: '宿題',
      en: 'Homework',
    },
    plural: {
      ja: '宿題',
      en: 'Homeworks',
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
      name: 'teacher',
      type: 'relationship',
      relationTo: 'teachers',
      hasMany: false,
    },
    {
      name: 'students',
      type: 'relationship',
      relationTo: 'students',
      hasMany: true,
    },
    {
      name: 'dueDate',
      type: 'date',
      required: false,
    },
    {
      name: 'issuedAt',
      type: 'date',
      required: false,
    },
    {
      name: 'files',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
  ],
  timestamps: true,
}
