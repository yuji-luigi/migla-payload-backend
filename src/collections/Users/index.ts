import { APIError, logError, type CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { isAdmin } from '../../hooks/showOnlyAdmin'
import { errorMessages } from '../../lib/error_messages'
import { User } from '../../payload-types'
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
    useAsTitle: 'name',
    components: {},
    hidden: ({ user }) => {
      return !isAdmin(user as unknown as User)
    },
  },

  hooks: {
    beforeLogin: [
      async ({ req, user, collection }) => {
        const t = req.i18n.t as any // <-- Cast to your custom keys

        try {
          let roleId = null

          const referer = req.headers.get('referer')
          if (referer && referer.startsWith('http')) {
            const url = new URL(referer)
            roleId = Number(url.searchParams.get('role'))
          } else if (req.query.role) {
            roleId = Number(req.query.role)
          }

          if (!roleId) {
            logError({ err: 'Please provide a role in the query or referer', payload: req.payload })
            throw new APIError('Role not found', 500, null, true)
          }
          if (user.roles.includes(roleId)) {
            user.currentRole = roleId
            // set the user role in the DB level. to authorize in dashboard.
            await req.payload.update({
              collection: collection.slug, // Use the collection name dynamically
              id: user.id, // User ID to update
              data: {
                currentRole: roleId, // Update the current role
              },
            })
            return user
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
