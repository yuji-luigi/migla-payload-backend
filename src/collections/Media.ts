import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { ApiError } from 'next/dist/server/api-utils'
import { STATUS_CODES } from 'http'
import { equal } from 'assert'
import { currentUserFilter } from '../access/filters/currentUserFilterNonAdmin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  labels: {
    singular: {
      ja: 'メディア',
      en: 'Media',
    },
    plural: {
      ja: 'メディア',
      en: 'Media',
    },
  },
  admin: {
    baseListFilter: currentUserFilter({ userKey: 'createdBy' }),
  },
  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation === 'create') {
          data.createdBy = req.user?.id
        }
        if (operation === 'update') {
          data.createdBy = req.user?.id
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',

      //required: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      maxDepth: 1,
      hasMany: false,
      required: true,

      admin: {
        // disabled: true,

        components: {
          // Label: '@/components/forms/label/UserFullnameSelect',
          // Field: '@/components/crud/user/UserSelectFullname',
          // Cell: '@/components/forms/label/UserFullnameSelect',
        },
      },
    },

    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],

  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
