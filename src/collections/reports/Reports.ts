import { equal } from 'assert'
import { slugField } from '@/fields/slug'
import { Where, type CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { reportHooks } from './hooks/reportHooks'
import { isAboveAdmin } from '../../hooks/showOnlyAdmin'

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
  access: {
    create: authenticated,
    delete: ({ req }) => {
      if (req.user?.currentRole?.isSuperAdmin) {
        return true
      }
      if (!req.user?.id) {
        return false
      }

      return {
        or: [
          {
            teacher: {
              equals: req.user.id,
            },
          },
          {
            createdBy: {
              equals: req.user.id,
            },
          },
        ] as Where[],
      }
    },
    read: async ({ req }) => {
      if (!req.user?.id || !req.user.currentRole) {
        return false
      }
      if (req.user.currentRole.isTeacher) {
        const userTeacher = await req.payload.find({
          collection: 'teachers',
          where: {
            user: {
              equals: req.user.id,
            },
          },
        })
        if (!userTeacher.docs[0]) {
          return false
        }
        return {
          teacher: {
            equals: userTeacher.docs[0].id,
          },
        } as Where
      }
      if (req.user.currentRole.isParent) {
        const { docs: students } = await req.payload.find({
          collection: 'students',
          where: {
            parent: {
              equals: req.user.id,
            },
          },
        })
        const ids = students.map((student) => student.id)
        return {
          students: { in: ids },
        }
      }
      if (isAboveAdmin(req.user)) {
        return true
      }
      return false
    },
    update: authenticated,
  },
  hooks: reportHooks,

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
    // {
    //   name: 'subtitle',
    //   label: {
    //     ja: 'サブタイトル',
    //     en: 'Subtitle',
    //     it: 'Sottotitolo',
    //   },
    //   type: 'text',
    //   required: false,
    //   localized: true,
    // },
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
    // {
    //   name: 'richBody',
    //   label: {
    //     ja: '本文',
    //     en: 'Body',
    //     it: 'Corpo',
    //   },
    //   type: 'richText',
    //   editor: lexicalEditor({
    //     features: ({ rootFeatures }) => {
    //       return [
    //         ...rootFeatures,
    //         HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    //         FixedToolbarFeature(),
    //         InlineToolbarFeature(),
    //       ]
    //     },
    //   }),

    //   required: false,
    //   localized: true,
    // },

    {
      name: 'coverImage',
      label: {
        ja: 'カバー画像',
        en: 'Cover Image',
        it: 'Immagine di copertura',
      },
      type: 'upload',
      relationTo: 'media',
      hasMany: false,
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
    {
      name: 'readRecords',
      type: 'join',
      collection: 'read-reports',
      on: 'report',
      admin: {
        hidden: true,
      },
      maxDepth: 0,
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
