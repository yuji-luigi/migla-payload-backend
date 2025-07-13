import { getMessaging } from 'firebase-admin/messaging'
import { CollectionAfterChangeHook } from 'payload'
import { Notification } from '../../../payload-types'

const handleSendNotification: CollectionAfterChangeHook<Notification> = async ({
  operation,
  req,
  doc,
}) => {
  const { docs: users } = await req.payload.find({
    collection: 'users',
    where: {
      fcmToken: {
        exists: true,
      },
    },
  })
  getMessaging()
    .sendEachForMulticast({
      tokens: users.map((user) => user.fcmToken).filter((token) => typeof token === 'string'),
      notification: {
        title: doc.title,
        body: doc.body,
      },
    })
    .then((response) => {
      console.log('Successfully sent message:', response)
    })
    .catch((error) => {
      console.log('Error sending message:', error)
    })
}

export const afterChangeNotification: CollectionAfterChangeHook<Notification>[] = [
  handleSendNotification,
]
export default afterChangeNotification
