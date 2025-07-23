import { CollectionAfterReadHook } from 'payload'
import { Notification } from '../../../payload-types'

export const createReadNotification: CollectionAfterReadHook<Notification> = async ({
  req,
  doc,
  collection,
  context,
  findMany,
}) => {
  if (!findMany) {
    await req.payload
      .create({
        collection: 'read-notifications',
        data: {
          user: req.user!.id,
          notification: doc.id,
        },
      })
      .catch((error) => {})
  }
}
