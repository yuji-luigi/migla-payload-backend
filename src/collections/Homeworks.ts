import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { getStudentsByClassroomId } from '../beforeChangeHooks/getStudentsByClassroomId'
import { findTeacherRoleOfUser } from '../access/filters/findTeacherRoleOfUser'
import { teacherOperationBeforeChange } from '../beforeChangeHooks/teacheRecordsBeforeChange'

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
  hooks: {
    beforeChange: [teacherOperationBeforeChange],
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
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
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
