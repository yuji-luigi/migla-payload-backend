import { APIError, getPayload, type CollectionConfig, type User } from 'payload'
import payloadConfig from '../payload.config'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { Role } from '../payload-types'
import internal from 'stream'
import { Classrooms } from './Classrooms'
import { getStudents } from '../beforeChangeHooks/getStudents'
import { findTeacherRoleOfUser } from '../access/filters/findTeacherRoleOfUser'
import { teacherOperationBeforeChange } from '../beforeChangeHooks/teacheRecordsBeforeChange'

export const Reports: CollectionConfig = {
  slug: 'reports',
  labels: {
    singular: {
      ja: 'レポート',
      en: 'Report',
    },
    plural: {
      ja: 'レポート',
      en: 'Reports',
    },
  },
  // only admins
  // access: {
  //   create: authenticated,
  //   delete: authenticated,
  //   read: anyone,
  //   update: authenticated,
  // },
  // admin: {
  //   useAsTitle: 'title',
  //   hidden: ({ user }: { user: User }) => {
  //     const hidden = !user?.roles.some(
  //       (role: Role) =>
  //         role.slug === 'teacher' || role.slug === 'super_admin' || role.slug === 'admin',
  //     )
  //     return hidden
  //   },
  // },

  hooks: {
    beforeChange: [teacherOperationBeforeChange],
    beforeRead: [async ({ req, query }) => {}],
  },
  fields: [
    {
      name: 'title',
      label: {
        ja: 'タイトル',
        en: 'Title',
        it: 'Titolo',
      },

      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      label: {
        ja: 'サブタイトル',
        en: 'Subtitle',
        it: 'Sottotitolo',
      },
      type: 'text',
      required: true,
      localized: true,
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
      localized: true,
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
      localized: true,
    },
    // TODO: CREATE CUSTOM COMPONENT TO SHOW ONLY TO SUPER_ADMIN in Form
    {
      name: 'students',
      label: {
        ja: '学生',
        en: 'Students',
        it: 'Studenti',
      },
      type: 'relationship',
      relationTo: 'students',
      hasMany: true,
      hidden: false, // TODO: hide after
      admin: {},
      // hidden: true,
    },

    {
      name: 'createdBy',
      label: {
        ja: '作成者',
        en: 'Created By',
        it: 'Creato da',
      },
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      // hidden: true,
    },
    {
      name: 'teacher',
      label: {
        ja: '先生',
        en: 'Teacher',
        it: 'Docente',
      },
      type: 'relationship',
      relationTo: 'teachers',
      hasMany: false,
      // hidden: true,
    },
    ...slugField(),
  ],

  timestamps: true,
}
