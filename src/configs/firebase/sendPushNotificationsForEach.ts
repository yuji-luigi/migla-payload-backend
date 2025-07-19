import { getMessaging } from 'firebase-admin/messaging'
import { FcmToken, Notification } from '../../payload-types'
import { CollectionSlug, Payload } from 'payload'

export function sendPushNotificationsForEach({
  payload,
  fcmTokens,
  title,
  body,
  imageUrl,
  data,
  collection,
  type,
}: {
  payload: Payload
  data?: Record<string, string>
  fcmTokens: FcmToken[]
  title: string
  body: string
  imageUrl?: string
  collection: CollectionSlug
  type: Notification['type'] | 'teacher_report'
}) {
  getMessaging()
    .sendEachForMulticast({
      tokens: fcmTokens
        .map((tokenData) => tokenData.token)
        .filter((token) => typeof token === 'string'),
      data,
      notification: {
        title: title,
        body: body,
        imageUrl: imageUrl,
      },
      android: {
        priority: 'high',
        notification: {
          title: title,
          body: body,
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: title,
              body: body,
            },
          },
        },
      },
    })
    .then((result) => {
      result.responses.forEach((res, index) => {
        if (!res.success && fcmTokens[index]?.id) {
          payload.delete({
            collection: 'fcmTokens',
            id: fcmTokens[index].id,
          })
        }
      })
      // console.log('Successfully sent message:', result)
    })
    .catch((error) => {
      console.log('Error sending message:', error)
    })
}
