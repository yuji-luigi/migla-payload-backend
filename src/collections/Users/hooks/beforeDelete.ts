import { CollectionBeforeDeleteHook, CollectionConfig } from 'payload'

export const beforeDeleteUserHook: CollectionBeforeDeleteHook[] = [
  async ({ collection, context, id, req }) => {
    console.dir({ collection, context, id }, { depth: null })
    await req.payload
      .delete({
        collection: 'read-notifications',
        where: {
          user: {
            equals: id,
          },
        },
      })
      .catch((error) => {
        console.error('Error deleting read notifications:', error)
      })
  },
]
