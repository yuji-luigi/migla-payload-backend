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
  // TODO: set the title and body based on the doc.type  ex: type == 'payment' => title: There is a new payment, body: New payment received from MIGLA. Check it out!
  sendPushNotificationsForEach({
    payload: req.payload,
    fcmTokens,
    title: doc.title,
    body: doc.body,
    collection: collection.slug,
    type: doc.type,
    isModifiedNotification: operation === 'update',
  })
}

export const afterChangeNotification: CollectionAfterChangeHook<Notification>[] = [
  handleSendNotification,
]
export default afterChangeNotification
