import { CollectionSlug } from 'payload'
import { FcmToken, Notification } from '../../payload-types'
import { BaseMessage } from 'firebase-admin/messaging'

export type NotificationMultiDto = {
  title: string
  body: string
  collection: CollectionSlug
  type: Notification['type']
  /**  our FcmToken record array */
  fcmTokens: FcmToken[]
  isModifiedNotification: boolean
  imageUrl?: string
  /** [key: string]: string */
  data?: BaseMessage['data']
}
