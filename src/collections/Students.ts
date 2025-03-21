import { getPayload, type CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import payloadConfig from '../payload.config'

export const Students: CollectionConfig = {
  slug: 'students',
  // upload: {
  //   adminThumbnail: 'thumbnail',
  //   imageSizes: [
  //     {
  //       name: 'thumbnail',
  //       width: 100,
  //     },
  //   ],
  // },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'roles'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  hooks: {},
  admin: {
    defaultColumns: ['name', 'surname', 'slug', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'surname',
      type: 'text',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'classroom',
      type: 'relationship',
      relationTo: 'classrooms',
      hasMany: false,
    },
    ...slugField('name'),
  ],
}
