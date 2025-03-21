import type { CollectionConfig } from 'payload'
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
  admin: {
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
  hooks: {},
  auth: true,

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
