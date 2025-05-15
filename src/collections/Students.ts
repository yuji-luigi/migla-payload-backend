import { APIError, FilterOptionsProps, getPayload, User, type CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import payloadConfig from '../payload.config'
import { Classroom } from '../payload-types'

export const Students: CollectionConfig = {
  slug: 'students',
  labels: {
    singular: {
      ja: '生徒',
      en: 'Student',
    },
    plural: {
      ja: '生徒',
      en: 'Students',
    },
  },

  // upload: {
  //   adminThumbnail: 'thumbnail',
  //   imageSizes: [
  //     {
  //       name: 'thumbnail',
  //       width: 100,
  //     },
  //   ],
  // },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'roles'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  hooks: {
    beforeChange: [
      async ({ req, operation, originalDoc, data }) => {
        console.log('beforeChange', req, operation, originalDoc)
        if (!req.user?.currentRole) {
          throw new APIError('You must logged in to complete the operation', 403, null, true)
        }
        const teacherDoc = await req.payload.find({
          collection: 'teachers',
          user: req.user.id,
        })
        console.log('teacher', teacherDoc.docs[0])
        data.classroom = (teacherDoc.docs[0]?.classroom as Classroom)?.id
      },
    ],
  },
  admin: {
    defaultColumns: ['name', 'surname', 'slug', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'surname',
      type: 'text',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'classroom',
      type: 'relationship',
      relationTo: 'classrooms',
      hasMany: false,
      filterOptions: async ({ user, req }: FilterOptionsProps<Classroom>) => {
        if (user?.currentRole) {
          console.log(user)
          if (user.currentRole.isTeacher) {
            const teacher = await req.payload.find({
              collection: 'teachers',
              user: user.id,
            })
            const teacherDoc = teacher.docs[0]
            if (!teacherDoc) {
              throw new APIError('Teacher not found', 404, null, true)
            }
            const classroomId =
              typeof teacherDoc.classroom === 'object'
                ? teacherDoc.classroom?.id
                : teacherDoc.classroom
            return {
              id: {
                equals: classroomId,
              },
            }
          }
          return true
        } else {
          throw new APIError('You must logged in to complete the operation', 403, null, true)
        }
      },
      admin: {
        // hidden: true,
        allowCreate: false,
        allowEdit: false,
      },
    },
    ...slugField('name'),
  ],
}
