import type { GlobalConfig } from 'payload'

import { revalidateLogoGlobal } from './hooks/revalidateLogoGlobal'
import { isAdmin } from '../hooks/showOnlyAdmin'

export const LogoGlobal: GlobalConfig = {
  slug: 'logoGlobal',
  access: {
    read: ({ req }) => {
      return isAdmin(req.user)
    },
  },
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
  ],
  hooks: {
    afterChange: [revalidateLogoGlobal],
  },
}
