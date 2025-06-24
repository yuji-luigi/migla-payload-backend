import { Teacher } from '../../payload-types'
import { APIError, type CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
import { isAdmin } from '../../hooks/showOnlyAdmin'
import { User } from '../../payload-types'
import { importClassrooms } from './endpoints/import-classrooms'

export const Classrooms: CollectionConfig = {
  slug: 'classrooms',
  labels: {
    singular: {
      ja: 'クラス',
      en: 'Classroom',
      it: 'Classe',
    },
    plural: {
      ja: 'クラス',
      en: 'Classrooms',
      it: 'Classi',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  endpoints: [importClassrooms],
  hooks: {
    // NOTE: too much to test. when necessary set unset readonly the teachers field
    // afterChange: [
    //   async ({ req: { user, payload }, doc, operation }) => {
    //     const paginatedTeachers = await payload.find({
    //       collection: 'teachers',
    //       where: { classroom: { equals: doc.id } },
    //     })
    //     const opTeachers = paginatedTeachers.docs.filter(
    //       (opTeacher: Teacher) => !doc.teachers.includes(opTeacher.id),
    //     )
    //     setImmediate(() => {
    //       opTeachers.forEach(async (opTeacher: Teacher) => {
    //         await payload.update({
    //           collection: 'teachers',
    //           id: opTeacher.id,
    //           data: {
    //             classroom: null,
    //           },
    //         })
    //       })
    //     })
    //     const teachersIds = doc.teachers.map((teacher: number) => teacher)
    //     const classroom = await payload.findByID({
    //       collection: 'classrooms',
    //       id: doc.id,
    //     })
    //   },
    // ],
  },
  admin: {
    useAsTitle: 'name',
    components: {
      Description: '@/collections/classrooms/components/Description',
    },
    hidden: ({ user }) => {
      return !isAdmin(user as unknown as User)
    },
    baseListFilter: ({ req: { user } }) => {
      if (!user) {
        throw new APIError('Please login for the list of classrooms', 401, null, true)
      }
      if (user?.currentRole?.isTeacher) {
        return {
          teacher: {
            equals: user.id,
          },
        }
      }
      return null
    },
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      unique: true,
      localized: true,
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'teachers',
      type: 'relationship',
      admin: { readOnly: true },
      relationTo: 'teachers',
      hasMany: true,
    },
    {
      name: 'ord',
      type: 'number',
      required: true,
      localized: false,
      defaultValue: 0,
    },
    ...slugField(),
  ],
  timestamps: true,
}
