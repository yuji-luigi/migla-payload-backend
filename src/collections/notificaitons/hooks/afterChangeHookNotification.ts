import { getMessaging } from 'firebase-admin/messaging'
import { CollectionAfterChangeHook } from 'payload'
import { Notification } from '../../../payload-types'
import { sendPushNotificationsForEach } from '../../../configs/firebase/sendPushNotificationsForEach'

const handleSendNotification: CollectionAfterChangeHook<Notification> = async ({
  operation,
  req,
  doc,
  collection,
}) => {
  const { docs: fcmTokens } = await req.payload.find({
    collection: 'fcmTokens',
  })
  sendPushNotificationsForEach({
    payload: req.payload,
    fcmTokens,
    title: doc.title,
    body: doc.body,
    collection: collection.slug,
    type: doc.type,
  })
}

export const afterChangeNotification: CollectionAfterChangeHook<Notification>[] = [
  handleSendNotification,
]
export default afterChangeNotification
