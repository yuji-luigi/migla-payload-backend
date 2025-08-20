import { CollectionAfterReadHook } from 'payload'
import { Notification } from '../../../payload-types'
import { extractID } from '../../../utilities/extractID'

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
    const userId = extractID(req.user)
    if (userId === -1) {
      return
    }
    // NOTE: this fails when there are multiple notifications so no await let it fail.(case of delete also runs this block.)
    req.payload
      .create({
        collection: 'read-notifications',
        data: {
          user: extractID(req.user),
          notification: doc.id,
        },
      })
      .catch((err) => {})
  }
}
