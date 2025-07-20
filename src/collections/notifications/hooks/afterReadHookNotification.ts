import { getMessaging } from 'firebase-admin/messaging'
import {
  CollectionAfterChangeHook,
  CollectionAfterReadHook,
  CollectionBeforeReadHook,
} from 'payload'
import { Notification } from '../../../payload-types'
import { sendPushNotificationsForEach } from '../../../configs/firebase/sendPushNotificationsForEach'

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
