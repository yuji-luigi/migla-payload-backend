import type { GlobalConfig } from 'payload'

import { revalidateLogoGlobal } from './hooks/revalidateLogoGlobal'
import { isAdmin } from '../hooks/showOnlyAdmin'

export const LogoGlobal: GlobalConfig = {
  slug: 'logoGlobal',
  // admin: {
  //   hidden: ({ user }) => !isAdmin(user),
  // },
  fields: [
    {
      name: 'logo_square',
      type: 'upload',
      label: 'Logo Square',
      relationTo: 'media',
    },
    {
      name: 'logo_rectangle',
      type: 'upload',
      label: 'Logo Rectangle',
      relationTo: 'media',
    },
    {
      name: 'logo_icon',
      type: 'upload',
      label: 'Logo Icon',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [revalidateLogoGlobal],
  },
}
