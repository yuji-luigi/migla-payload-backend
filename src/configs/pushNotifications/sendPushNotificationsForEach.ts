import { getMessaging } from 'firebase-admin/messaging'
import { FcmToken, Notification } from '../../payload-types'
import { BasePayload, CollectionSlug, Payload } from 'payload'
import { push_notifications } from '../../payload-generated-schema'
import { extractID } from '../../utilities/extractID'
import { NotificationMultiDto } from './NotificationBaseDto'

export async function sendPushNotificationsForEach({
  payload,
  // fcmTokens,
  // title,
  // body,
  // imageUrl,
  notificationBaseDto,
  shouldCreateNotification = true,
  // data,
  // collection,
  // type,
  // isModifiedNotification,
}: {
  payload: Payload | BasePayload
  data?: Record<string, string>
  // fcmTokens: FcmToken[]
  // title: string
  // body: string
  // imageUrl?: string
  // collection: CollectionSlug
  // type: Notification['type']
  // isModifiedNotification: boolean
  notificationBaseDto: NotificationMultiDto
  shouldCreateNotification?: boolean
}) {
  if (shouldCreateNotification) {
    payload.create({
      collection: 'notifications',
      data: {
        ...notificationBaseDto,
        users: notificationBaseDto.fcmTokens
          .filter((fcmToken) => !!fcmToken.user)
          .map((fcmToken) => extractID(fcmToken.user)),
      },
    })
  }

  getMessaging()
    .sendEachForMulticast({
      tokens: notificationBaseDto.fcmTokens
        .map((tokenData) => tokenData.token)
        .filter((token) => typeof token === 'string'),
      data: notificationBaseDto.data,
      notification: {
        title: notificationBaseDto.title,
        body: notificationBaseDto.body,
        imageUrl: notificationBaseDto.imageUrl,
      },
      android: {
        priority: 'high',
        notification: {
          title: notificationBaseDto.title,
          body: notificationBaseDto.body,
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: notificationBaseDto.title,
              body: notificationBaseDto.body,
            },
          },
        },
      },
    })
    .then((result) => {
      result.responses.forEach((res, index) => {
        if (!res.success && notificationBaseDto.fcmTokens[index]?.id) {
          payload.delete({
            collection: 'fcmTokens',
            id: notificationBaseDto.fcmTokens[index].id,
          })
        }
      })
      // console.log('Successfully sent message:', result)
    })
    .catch((error) => {
      console.log('Error sending message:', error.errorInfo)
    })
}
