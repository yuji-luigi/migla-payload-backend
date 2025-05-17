import { getPayload, type CollectionConfig, type User } from 'payload'
import payloadConfig from '../payload.config'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { Role } from '../payload-types'
import internal from 'stream'
import { Classrooms } from './Classrooms'
import { getStudents } from '../beforeChangeHooks/getStudents'

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
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    hidden: ({ user }: { user: User }) => {
      const hidden = !user?.roles.some(
        (role: Role) =>
          role.slug === 'teacher' || role.slug === 'super_admin' || role.slug === 'admin',
      )
      return hidden
    },
  },

  hooks: {
    beforeChange: [
      async ({ req, operation, originalDoc, data }) => {
        const payload = await getPayload({ config: payloadConfig })

        const userId = req.user?.id
        if (!userId) {
          throw new Error('User not authenticated')
        }
        if (operation === 'update') {
          // return
        }

        // Step 1: Get the teacher document for this user
        const teacherQuery = await payload.find({
          collection: 'teachers',
          where: {
            user: {
              equals: userId,
            },
          },
          limit: 1,
        })
        const teacher = teacherQuery.docs[0]
        if (!teacher) {
          throw new Error('Teacher not found')
        }
        data.createdBy = teacher.id
        if (!teacher || !teacher.classroom) {
          throw new Error('Teacher or classroom not found')
        }
        let classroomId =
          typeof teacher.classroom == 'number' ? teacher.classroom : teacher.classroom.id

        // Step 2: Get all students in that classroom
        const students = await getStudents({ payload, classroomId })

        data.students = students.map((student) => student.id)
      },
    ],
    beforeRead: [async ({ req, query }) => {}],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'body',
      type: 'textarea',

      required: true,
      localized: true,
    },

    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      localized: true,
    },
    // TODO: CREATE CUSTOM COMPONENT TO SHOW ONLY TO SUPER_ADMIN in Form
    {
      name: 'students',
      type: 'relationship',
      relationTo: 'students',
      hasMany: true,
      hidden: false, // TODO: hide after
      admin: {},
      // hidden: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'teachers',
      hasMany: false,
      // hidden: true,
    },
    ...slugField(),
  ],

  timestamps: true,
}
