import { APIError, FilterOptionsProps, type CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { findTeacherRoleOfUser } from '../../access/filters/findTeacherRoleOfUser'
import { Classroom } from '../../payload-types'
import { parseExcelToJson } from '../../lib/excel/parseExcelToJson'
import { importStudents } from './endpoints/importStudents'
import { studentsEndpoints } from './endpoints'
import { setQueryBeforeChange } from './hooks/beforeChange'
export const studentsModal = {
  slug: 'students',
  labels: {
    singular: {
      ja: '生徒',
      en: 'Student',
    },
  },
}
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
  // endpoints: [importStudents],
  // upload: {
  //   bulkUpload: true,
  //   handlers: [
  //     async (req) => {
  //       return Response.json({
  //         message: `Hello ${req.routeParams?.name as string} @ ${req.routeParams?.group as string}`,
  //       })
  //     },
  //   ],
  // },
  endpoints: studentsEndpoints,
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req: { user } }) => {
      if (!user?.currentRole) {
        // TODO: it is called in login page find out why
        return false
        // throw new APIError('you must login to get this data', 403, null, true)
      }
      if (user?.currentRole.isParent) {
        return {
          parent: {
            equals: user.id,
          },
        }
      }
      return true
    },
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
    beforeChange: [setQueryBeforeChange],
  },
  admin: {
    defaultColumns: ['name', 'surname', 'slug', 'updatedAt'],
    useAsTitle: 'name',
    components: {
      // afterList: [
      //   {
      //     path: '@/collections/students/ui/StudentsImportModal',
      //     clientProps: { slug: 'students' },
      //   },
      // ],
      Description: '@/collections/students/ui/DescriptionStudents.tsx',
      views: {
        list: {
          // actions: ['@/collections/students/ui/UploadStudents.tsx'],
          // Component: '@/collections/students/ui/UploadStudents.tsx',
        },
      },
      edit: {
        // Upload: '@/collections/students/ui/UploadStudents.tsx',
      },
    },

    baseListFilter: async ({ req }) => {
      if (!req.user) {
        throw new APIError('You must logged in to complete the operation', 403, null, true)
      }
      if (!req.user.currentRole?.isAdminLevel) {
        const foundTeacher = await findTeacherRoleOfUser({ user: req.user, payload: req.payload })
        if (foundTeacher?.classroom) {
          return {
            classroom: {
              equals:
                typeof foundTeacher?.classroom === 'object'
                  ? foundTeacher?.classroom?.id
                  : foundTeacher?.classroom,
            },
          }
        }
      }
      return null
    },
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
      name: 'birthday',
      type: 'date',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      filterOptions: async ({ user, req }) => {
        if (req.context.isAdminOperation) {
          return true
        }
        if (!user) {
          throw new APIError(
            'filterOptions error: user is not logged in. collection: students',
            403,
            null,
            true,
          )
        }
        if (user.currentRole?.isAdminLevel) {
          return true
        }
        if (user.currentRole?.isTeacher) {
          const isParentRoles = await req.payload.find({
            collection: 'roles',
            where: {
              isParent: {
                equals: true,
              },
            },
          })
          if (isParentRoles.docs.length > 0) {
            return {
              roles: {
                in: isParentRoles.docs.map<number>((teacher) => teacher.id),
              },
            }
          }
          return false
        }
        throw new APIError('userCurrentRole is not defined or saved in DB.', 403, null, true)
      },
    },
    {
      name: 'classroom',
      type: 'relationship',
      relationTo: 'classrooms',
      hasMany: false,
      filterOptions: async ({ user, req }: FilterOptionsProps<Classroom>) => {
        if (req.context.isAdminOperation) {
          return true
        }
        if (user?.currentRole) {
          if (user.currentRole.isTeacher) {
            const foundTeacher = await findTeacherRoleOfUser({ user, payload: req.payload })
            const classroomId =
              typeof foundTeacher?.classroom === 'object'
                ? foundTeacher?.classroom?.id
                : foundTeacher?.classroom
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
    ...slugField('slug', { slugOverrides: { required: true } }),
  ],
}
