import {
  APIError,
  AuthenticationError,
  withNullableJSONSchemaType,
  type AuthStrategyResult,
  type CollectionConfig,
} from 'payload'
import { authenticated } from '../../access/authenticated'
import { Role } from '../../payload-types'
function getIsAdmin(hydratedRoles: (Role | number)[]) {
  return hydratedRoles
    ?.map((role) => (typeof role === 'object' ? role.slug : null))
    .some((role) => role === 'admin' || role === 'super_admin')
}
export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,

    create: async ({ req }) => {
      if (req.user) {
        const user = await req.payload.findByID({
          collection: 'users',
          id: req.user?.id,
          depth: 2, // Populate roles up to 2 levels deep
        })
        console.log(user)
        if (user.roles && getIsAdmin(user.roles)) {
          return true
        }
      }
      return false
    },
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
      console.log(user)
      if (user.roles && getIsAdmin(user.roles)) {
        return true
      }

      return false
    },
    delete: async ({ req }) => {
      if (req.user) {
        const user = await req.payload.findByID({
          collection: 'users',
          id: req.user?.id,
          depth: 2, // Populate roles up to 2 levels deep
        })
        console.log(user)
        if (user.roles && getIsAdmin(user.roles)) {
          return true
        }
      }
      return false
    },
    read: authenticated,
  },
  auth: true,
  admin: {
    defaultColumns: ['name', 'surname', 'email'],
    useAsTitle: 'name',
    components: {},
    // hidden: ({ user }) => {
    //   if (user?.roles && getIsAdmin(user.roles)) {
    //     return false
    //   }
    //   return true
    // },
  },

  hooks: {
    me: [({ user, args }) => {}],

    beforeLogin: [
      async ({ req, user, collection }) => {
        try {
          const referer = req.headers.get('referer')
          if (referer && referer.startsWith('http')) {
            const url = new URL(referer)
            const roleId = Number(url.searchParams.get('role'))
            if (!roleId) {
              throw new APIError('Role not found', 500, null, true)
            }

            if (user.roles.includes(roleId)) {
              user.currentRole = roleId
              // Correct way to update user document
              await req.payload.update({
                collection: collection.slug, // Use the collection name dynamically
                id: user.id, // User ID to update
                data: {
                  currentRole: roleId, // Update the current role
                },
              })
            } else {
              throw new APIError("You don't have access to this role", 403, null, true)
            }
            return
          }
          throw new Error('test')
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
    },
    {
      saveToJWT: true,
      name: 'currentRole',
      type: 'relationship',
      relationTo: 'roles',
      hidden: true,
    },
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',

      hasMany: true,
    },
  ],
  timestamps: true,
}
