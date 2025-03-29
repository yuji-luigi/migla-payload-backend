import type { AuthStrategyResult, CollectionConfig } from 'payload'
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
  /* {
    strategies: [
      {
        name: 'custom-strategy',
        authenticate: async ({ payload, headers }): Promise<AuthStrategyResult> => {
          console.log('ji')
          const usersQuery = await payload.find({
            collection: 'users',
            where: {
              code: {
                equals: headers.get('code'),
              },
              secret: {
                equals: headers.get('secret'),
              },
            },
          })

          return {
            // Send the user with the collection slug back to authenticate,
            // or send null if no user should be authenticated
            user: usersQuery.docs[0]
              ? {
                  collection: 'users',
                  ...usersQuery.docs[0],
                }
              : null,

            // Optionally, you can return headers
            // that you'd like Payload to set here when
            // it returns the response
            responseHeaders: new Headers({
              'some-header': 'my header value',
            }),
          }
        },
      },
    ],
  } */ admin: {
    defaultColumns: ['name', 'surname', 'email'],
    useAsTitle: 'name',
    components: {
      // views: {
      //   list: {
      //     Component: '@/components/Tryout/CustomComponent.tsx',
      //   },
      // },
      // beforeList: ['@/components/Tryout/CustomComponent.tsx'],
    },
  },
  hooks: {
    afterLogin: [
      ({ req, user }) => {
        console.log({ req, user })
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
    // {
    //   type: 'ui',
    //   name: 'fullname',
    //   admin: {
    //     components: {
    //       Cell: '@/components/Tryout/CustomComponent.tsx',
    //     },
    //   },
    // },
    {
      name: 'email',
      type: 'email',
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
