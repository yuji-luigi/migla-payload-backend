import { Teacher } from '../../payload-types'
import { APIError, type CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
import { isAdmin, isSuperAdmin } from '../../hooks/showOnlyAdmin'
import { User } from '../../payload-types'
import { importClassrooms } from './endpoints/import-classrooms'
import { CustomTranslationsKeys } from '../../lib/i18n/i18n_configs'
import { I18nTFunc } from '../../types/my_types/i18n_types'

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
    beforeDelete: [
      async ({ req: { payload, data, i18n }, id }) => {
        const t = i18n.t as any as I18nTFunc
        const {
          docs: [foundTeacher],
        } = await payload.find({
          collection: 'teachers',
          depth: 0,
          limit: 1,
          where: { classroom: { equals: id } },
        })
        if (foundTeacher) {
          throw new Error(
            t('errors:delete:classroom', {
              reason: `Assigned teacher to the classroom: ${foundTeacher.name}. please delete before the teacher from teacher collection`,
            }),
          )
        }
      },
    ],

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
      return !isAdmin(user) && !isSuperAdmin(user)
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
  defaultSort: 'ord',
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
    ...slugField('slug'),
  ],
  timestamps: true,
}
