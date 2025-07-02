import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
import { isAdmin } from '../../hooks/showOnlyAdmin'
import { User } from '../../payload-types'
import { importTeachers } from './endpoints/import-teachers'
import DescriptionTeachers from './ui/DescriptionTeachers'
import TeacherImportModal from './ui/TeacherImportModal'

export const Teachers: CollectionConfig = {
  labels: {
    singular: {
      ja: '先生',
      en: 'Teacher',
      it: 'Docente',
    },
    plural: {
      ja: '先生',
      en: 'Teachers',
      it: 'Docenti',
    },
  },
  slug: 'teachers',
  endpoints: [importTeachers],
  hooks: {
    afterChange: [
      async ({ req: { user, payload }, doc, operation }) => {
        setImmediate(async () => {
          if (doc.classroom) {
            const newClassroomId = doc.classroom.id || doc.classroom
            const classroom = await payload.findByID({
              collection: 'classrooms',
              id: newClassroomId,
              depth: 0,
            })
            if (classroom) {
              classroom.teachers = [...new Set([...(classroom.teachers as number[]), doc.id])]
              await payload.update({
                collection: 'classrooms',
                id: newClassroomId,
                data: classroom,
              })
            }
            const { docs: prevClassrooms } = await payload.find({
              collection: 'classrooms',
              where: {
                teachers: {
                  contains: doc.id,
                },
              },
              depth: 0,
            })
            const removingClassrooms = prevClassrooms.filter(
              (classroom) => classroom.id !== newClassroomId,
            )

            if (removingClassrooms.length > 0) {
              removingClassrooms.forEach(async (classroom) => {
                classroom.teachers = classroom.teachers?.filter((teacher) => teacher !== doc.id)
                await payload.update({
                  collection: 'classrooms',
                  id: classroom.id,
                  data: classroom,
                })
              })
            }
          }
        })
      },
    ],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => {
      return !isAdmin(user as unknown as User)
    },
    components: {
      beforeList: ['@/collections/teachers/ui/TeacherImportModal'],
      Description: '@/collections/teachers/ui/DescriptionTeachers',
    },
  },

  fields: [
    {
      name: 'name',
      label: {
        ja: '名前',
        en: 'Name',
        it: 'Nome',
      },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'isAssistant',
      label: {
        ja: 'アシスタント',
        en: 'Assistant',
        it: 'Assistente',
      },
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'user',
      label: {
        ja: 'ユーザー',
        en: 'User',
        it: 'Utente',
      },
      type: 'relationship',
      relationTo: 'users',
      unique: true,
      required: true,
      // maxDepth: 0,
      hasMany: false,
    },
    {
      name: 'classroom',
      label: {
        ja: 'クラス',
        en: 'Classroom',
        it: 'Classe',
      },
      type: 'relationship',
      relationTo: 'classrooms',
      hasMany: false,
    },
    ...slugField('name'),
  ],
  timestamps: true,
}
