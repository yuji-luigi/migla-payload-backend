import { equal } from 'assert'
import { APIError, logError, Where, type CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { isAboveAdmin, isAdmin, isSuperAdmin } from '../../hooks/showOnlyAdmin'
import { errorMessages } from '../../lib/error_messages'
import { Role, User } from '../../payload-types'
import { importUsers } from './endpoints/importUsers'
import { beforeDeleteUserHook } from './hooks/beforeDelete'
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: {
      ja: 'ユーザー',
      en: 'User',
    },
    plural: {
      ja: 'ユーザー',
      en: 'Users',
    },
  },
  endpoints: [importUsers],
  access: {
    admin: authenticated,

    create: async ({ req }) => isAboveAdmin(req.user),

    update: async ({ req, id }) => {
      if (req.user?.id === id) {
        return true
      }
      if (!req.user) {
        throw new APIError('You must be logged in to access this resource', 401, null, true)
      }
      return isAboveAdmin(req.user)
    },
    delete: async ({ req }) => {
      if (req.user) {
        if (req.user.currentRole?.isSuperAdmin || req.user.currentRole?.isAdmin) {
          return true
        }
      }
      return false
    },
    read: authenticated,
  },
  auth: {
    // tokenExpiration: 1, // 1 second
    tokenExpiration: 1000 * 60 * 60 * 24 * 2, // 2 days
  },
  admin: {
    defaultColumns: ['name', 'surname', 'email'],
    useAsTitle: 'fullname',
    components: {
      // beforeList

      beforeList: [
        {
          path: '@/collections/Users/ui/UserImportModal.tsx',
          clientProps: { slug: 'users' },
          serverProps: { slug: 'users' },
        },
      ],
      Description: {
        path: '@/collections/Users/ui/DescriptionUsers.tsx',
        serverProps: { slug: 'users' },
        clientProps: { slug: 'users' },
      },
    },
    hidden: ({ user }) => {
      return !isAboveAdmin(user) && !isSuperAdmin(user)
    },
  },

  hooks: {
    beforeOperation: [
      async ({ req, operation, context, args }) => {
        if (context.bypassCheck) {
          return args
        }
        if (operation === 'create' && req.url?.includes('/api/users/first-register')) {
          const paginatedSuperAdminRole = await req.payload.find({
            collection: 'roles',
            where: {
              name: {
                equals: 'super_admin',
              },
            },
          })
          if (req.data) {
            // const user = await req.payload.findByID({ collection: 'users', id: req.data.id })
            args.data.roles = [paginatedSuperAdminRole.docs[0]?.id]
            args.data.currentRole = paginatedSuperAdminRole.docs[0]
          }
          return args
        }

        return args
      },
    ],
    beforeDelete: beforeDeleteUserHook,

    beforeLogin: [
      async ({ req, user, collection }) => {
        const t = req.i18n.t as any // <-- Cast to your custom keys
        try {
          let roleIds: number[] | null = null

          const referer = req.headers.get('referer')
          if (referer && referer.includes('/admin/create-first-user')) {
            return
          }

          if (referer && referer.startsWith('http')) {
            const url = new URL(referer)
            roleIds = [Number(url.searchParams.get('role'))]
          } else if (req.query.role) {
            roleIds = [Number(req.query.role)]
          }

          if (req.query['role-name'] == 'parent') {
            const paginatedRoles = await req.payload.find({
              collection: 'roles',
              where: {
                isParent: {
                  equals: true,
                },
              },
            })
            roleIds = paginatedRoles.docs.map((role) => role.id)
          }

          if (!roleIds?.length) {
            logError({ err: 'Please provide a role in the query or referer', payload: req.payload })
            throw new APIError('Role not found', 500, null, true)
          }

          const matchedRole = user.roles.find((userRole: number) => roleIds.includes(userRole))
          if (matchedRole) {
            const currentRole = await req.payload.findByID({
              collection: 'roles',
              id: matchedRole,
            })
            // set the user role in the DB level. to authorize in dashboard.
            await req.payload.update({
              collection: collection.slug, // Use the collection name dynamically
              id: user.id, // User ID to update
              data: {
                currentRole, // Update the current role
              },
            })
            return
          }
          throw new APIError(t(errorMessages.ERROR_NO_ROLE), 403, null, true)
        } catch (error) {
          console.error('Error in beforeLogin hook:', error)
          throw error
        }
      },
    ],
  },

  fields: [
    // {
    //   type: 'row',

    //   fields: [
    //     {
    //       name: 'name',
    //       type: 'text',
    //       required: true,
    //     },
    //     {
    //       name: 'surname',
    //       type: 'text',
    //       required: true,
    //     },
    //   ],
    // },
    {
      type: 'row',

      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'surname',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },

    {
      name: 'email',
      type: 'email',
      unique: true,
    },
    {
      saveToJWT: true,
      name: 'currentRole',
      type: 'group',
      admin: {
        hidden: true,
      },

      fields: [
        // NOTE: tried to se the id under the group but it was always undefined/null
        // {
        //   name: 'id',
        //   type: 'number',
        // },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'isSuperAdmin',
          type: 'checkbox',
        },
        {
          name: 'isAdmin',
          type: 'checkbox',
        },
        {
          name: 'isTeacher',
          type: 'checkbox',
        },
        {
          name: 'isParent',
          type: 'checkbox',
        },
      ],
    },
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      maxDepth: 2,
      hasMany: true,

      filterOptions: async ({ req }) => {
        if (req.user) {
          if (req.user?.currentRole?.isSuperAdmin) {
            return true
          }
          return {
            or: [
              {
                isSuperAdmin: {
                  equals: false,
                },
              },
              {
                isSuperAdmin: {
                  exists: false,
                },
              },
            ] as Where[],
          }
        }
        return true
      },
    },
    {
      name: 'fcmToken',
      type: 'text',
    },
    {
      name: 'fullname',
      type: 'text',
      virtual: true, // <— mark as virtual
      admin: { hidden: true },
      hooks: {
        afterRead: [
          async ({ siblingData, req }) => {
            if (!('name' in siblingData)) {
              const user = await req.payload.findByID({
                collection: 'users',
                id: siblingData.id,
              })
              if (req.locale === 'ja') {
                return `${user.surname} ${user.name}`
              }
              return `${user.name} ${user.surname}`
            } else {
              if (req.locale === 'ja') {
                return `${siblingData.surname} ${siblingData.name}`
              }
              return `${siblingData.name} ${siblingData.surname}`
            }
          },
        ],
      },
    },
  ],
  timestamps: true,
}
