import { getPayload, type CollectionConfig, type User } from 'payload'
import payloadConfig from '../payload.config'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { Role } from '../payload-types'

export const Reports: CollectionConfig = {
  slug: 'reports',
  // only admins
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    hidden: ({ user }: { user: User }) => {
      const hidden = !user.roles.some(
        (role: Role) =>
          role.slug === 'teacher' || role.slug === 'super_admin' || role.slug === 'admin',
      )
      return hidden
    },
  },

  hooks: {
    beforeChange: [
      async ({ req, operation, originalDoc, data }) => {
        // console.log({ req, operation, originalDoc, data })
        const payload = await getPayload({ config: payloadConfig })
        // const teacher = await payload.db.drizzle.select().from(teachers).where(eq(teachers.user, req.user.id))
        const students = await payload.find({
          collection: 'students',
          where: {
            classroom: data.classroom,
          },
        })
        console.log({ students })
        throw new Error('Not allowed')
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },

    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    // TODO: CREATE CUSTOM COMPONENT TO SHOW ONLY TO SUPER_ADMIN in Form
    {
      name: 'students',
      type: 'relationship',
      relationTo: 'students',
      hasMany: true,
      hidden: true,
    },
    ...slugField(),
  ],

  timestamps: true,
}
