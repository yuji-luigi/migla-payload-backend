import { APIError, logError, type CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { isAdmin } from '../../hooks/showOnlyAdmin'
import { errorMessages } from '../../lib/error_messages'
import { Role, User } from '../../payload-types'
import { importUsers } from './usersEndpoints/importUsers'
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

    create: async ({ req }) => isAdmin(req.user),

    update: async ({ req, id }) => {
      if (req.user?.id === id) {
        return true
      }
      if (!req.user) {
        throw new APIError('You must be logged in to access this resource', 401, null, true)
      }
      const user = await req.payload.findByID({
        collection: 'users',
        id: req.user?.id,
        depth: 2, // Populate roles up to 2 levels deep
      })
      return isAdmin(user)
    },
    delete: async ({ req }) => {
      if (req.user) {
        const user = await req.payload.findByID({
          collection: 'users',
          id: req.user?.id,
          depth: 2, // Populate roles up to 2 levels deep
        })
        return isAdmin(user)
      }
      return false
    },
    read: authenticated,
  },
  auth: true,
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
      return !isAdmin(user as unknown as User)
    },
  },

  hooks: {
    beforeOperation: [
      async ({ req, operation, context, args }) => {
        console.log(req.url)

        if (operation === 'create' && req.url?.includes('/api/users/first-register')) {
          const paginatedSuperAdminRole = await req.payload.find({
            collection: 'roles',
            where: {
              name: {
                equals: 'super_admin',
              },
            },
          })
          console.log(req.data)
          if (req.data) {
            // const user = await req.payload.findByID({ collection: 'users', id: req.data.id })
            args.data.roles = [paginatedSuperAdminRole.docs[0]?.id]
            args.data.currentRole = paginatedSuperAdminRole.docs[0]
          }
          console.log(req.data)
          console.log(args)
          return args
          throw new APIError('inside', 500, null, true)
        }

        return
        throw new APIError(`outside ${req.url}`, 500, null, true)
      },
    ],
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
            console.log('sfda')
            const currentRole = await req.payload.findByID({
              collection: 'roles',
              id: matchedRole,
            })
            console.log(currentRole)
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
    {
      type: 'row',

      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'surname',
          type: 'text',
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
          name: 'isAdminLevel',
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

      // filterOptions: async ({ req }) => {
      //   console.log(req.user)
      //   console.log(req.user?.currentRole?.isSuperAdmin)
      //   if (req.user?.currentRole?.isSuperAdmin) {
      //     return true
      //   }
      //   return {
      //     isAdminLevel: {
      //       equals: false,
      //       exists: false,
      //     },
      //   }
      // },
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
