import { getMessaging } from 'firebase-admin/messaging'
import { CollectionAfterChangeHook } from 'payload'
import { Notification } from '../../../payload-types'
import { sendPushNotificationsForEach } from '../../../configs/pushNotifications/sendPushNotificationsForEach'

const handleSendNotification: CollectionAfterChangeHook<Notification> = async ({
  operation,
  req,
  doc,
  collection,
}) => {
  const { docs: fcmTokens } = await req.payload.find({
    collection: 'fcmTokens',
  })

  // TODO: consider send push notifications here by stored user list
  // sendPushNotificationsForEach({
  //   payload: req.payload,
  //   shouldCreateNotification: false,
  //   notificationBaseDto: {
  //     fcmTokens,
  //     title: doc.title,
  //     body: doc.body,
  //     collection: collection.slug,
  //     type: doc.type,
  //     isModifiedNotification: operation === 'update',
  //   },
  // })
}

export const afterChangeNotification: CollectionAfterChangeHook<Notification>[] = [
  handleSendNotification,
]
export default afterChangeNotification
