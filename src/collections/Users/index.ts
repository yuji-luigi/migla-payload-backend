import {
  APIError,
  AuthenticationError,
  withNullableJSONSchemaType,
  type AuthStrategyResult,
  type CollectionConfig,
} from 'payload'
import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  auth: true,
  admin: {
    defaultColumns: ['name', 'surname', 'email'],
    useAsTitle: 'name',
    components: {},
  },

  hooks: {
    me: [
      ({ user, args }) => {
        console.log('Me:', user)
      },
    ],

    beforeLogin: [
      async ({ req, user, collection }) => {
        try {
          const referer = req.headers.get('referer')
          if (referer && referer.startsWith('http')) {
            const url = new URL(referer)
            console.log('jfipdoa')
            const roleId = Number(url.searchParams.get('role'))
            console.log(roleId)
            if (!roleId) {
              throw new APIError('Role not found', 500, null, true)
            }
            console.log('Before Login:', user)
            console.log('Role:', roleId)
            console.log('User roles:', user.roles)
            if (user.roles.includes(roleId)) {
              user.currentRole = roleId
              console.log('success!!:')
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
    afterLogin: [
      ({ req, user, context, token, collection }) => {
        try {
          const referer = req.headers.get('referer')
          if (referer && referer.startsWith('http')) {
            const url = new URL(referer)
            const role = url.searchParams.get('role')

            if (role) {
              // Validate and assign the role to the user session
              const userRoles = user.roles?.map((r: any) => r.slug) || []

              if (userRoles.includes(role)) {
                // Stamp the selected role onto the session
                if (req.user) {
                  context.role = role
                  console.log(`User logged in with role: ${role}`)
                } else {
                  console.warn(`Invalid role selected: ${role}`)
                }
              } else {
                console.warn('No role provided in URL')
              }
            }
          } else {
            console.warn('Referer header is not a valid URL or is missing')
          }
        } catch (error) {
          console.error('Error extracting role from URL:', error)
        }
      },
    ],
    beforeRead: [
      ({ req, query, context }) => {
        console.log('Context:', context)
        console.log('user:', req.user)
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
