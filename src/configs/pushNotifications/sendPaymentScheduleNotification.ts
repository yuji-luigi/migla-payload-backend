import { CollectionSlug, Payload } from 'payload'
import { FcmToken, Notification, PaymentSchedule, Report } from '../../payload-types'
import { sendPushNotificationsForEach } from './sendPushNotificationsForEach'
import { I18n } from '@payloadcms/translations'
import { I18nTFunc } from '../../types/my_types/i18n_types'
import { extractID } from '../../utilities/extractID'
import { notificationHooks } from '../../collections/paymentSchedules/hooks/notificationHooks'
import { NotificationMultiDto } from './NotificationBaseDto'

export async function sendPaymentScheduleNotification({
  fcmTokens,
  payload,
  isModifiedNotification,
  paymentSchedule,
  // t,
}: {
  fcmTokens: FcmToken[]
  payload: Payload
  isModifiedNotification: boolean
  paymentSchedule: PaymentSchedule
  // t: I18n['t']
}) {
  const title = '支払いのお知らせ'
  const notificationBaseDto: NotificationMultiDto = {
    title,
    body: paymentSchedule.name,
    fcmTokens,
    isModifiedNotification,
    data: {
      collectionRecordId: paymentSchedule.id.toString(),
      collection: 'payment-schedules',
      type: 'payment_record',
    },
  }

  sendPushNotificationsForEach({
    notificationBaseDto,
    payload,
    pushNotificationBody: paymentSchedule.notificationBody,
  })
}
