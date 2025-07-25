import { CollectionAfterReadHook } from 'payload'
import { Notification } from '../../../payload-types'

export const createReadNotification: CollectionAfterReadHook<Notification> = async ({
  req,
  doc,
  collection,
  context,
  findMany,
}) => {
  if (findMany) {
  }
  if (!findMany) {
    // NOTE: this fails when there are multiple notifications so no await let it fail.(case of delete also runs this block.)
    req.payload.create({
      collection: 'read-notifications',
      data: {
        user: req.user!.id,
        notification: doc.id,
      },
    })
  }
}
