import { CollectionSlug, Payload } from 'payload'
import { FcmToken, Notification, Report } from '../../payload-types'
import { sendPushNotificationsForEach } from './sendPushNotificationsForEach'
import { I18n } from '@payloadcms/translations'
import { I18nTFunc } from '../../types/my_types/i18n_types'
import { extractID } from '../../utilities/extractID'
import { notificationHooks } from '../../collections/paymentSchedules/hooks/notificationHooks'
import { NotificationMultiDto } from './NotificationBaseDto'

export function sendTeacherReportNotification({
  fcmTokens,
  payload,
  isModifiedNotification,
  report,
  t,
}: {
  fcmTokens: FcmToken[]
  payload: Payload
  isModifiedNotification: boolean
  report: Report
  t: I18n['t']
}) {
  const _t = t as unknown as I18nTFunc
  const title = '先生からの通信' + (isModifiedNotification ? ' (更新)' : '')
  const notificationBaseDto: NotificationMultiDto = {
    title,
    body: `${report.title}\n${report.body}`,
    collection: 'reports',
    type: 'teacher_report',
    fcmTokens,
    isModifiedNotification,
    data: {
      reportId: report.id.toString(),
    },
  }

  sendPushNotificationsForEach({
    // collection: 'reports',
    // title: '先生からの通信',
    // body: `${report.title}\n${report.body}`,
    // type: 'teacher_report',
    notificationBaseDto,
    payload,
    // ...notificationBaseDto,
    // fcmTokens,
    // payload: payload,
    // isModifiedNotification,
  })
}
