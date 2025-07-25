import { Payload } from 'payload'
import { FcmToken, Report } from '../../payload-types'
import { sendPushNotificationsForEach } from './sendPushNotificationsForEach'
import { I18n } from '@payloadcms/translations'
import { I18nTFunc } from '../../types/my_types/i18n_types'
import { extractID } from '../../utilities/extractID'

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
  payload.create({
    collection: 'notifications',
    data: {
      title: _t('notifications:teacherReport:title'),
      body: report.title,
      collection: 'reports',
      type: 'teacher_report',
      users: fcmTokens
        .filter((fcmToken) => !!fcmToken.user)
        .map((fcmToken) => extractID(fcmToken.user)),
    },
  })
  sendPushNotificationsForEach({
    collection: 'reports',
    fcmTokens,
    title: '先生からの通信',
    body: `${report.title}\n${report.body}`,
    type: 'teacher_report',
    payload: payload,
    isModifiedNotification,
  })
}
