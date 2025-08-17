import { CollectionSlug, Payload } from 'payload'
import { FcmToken, Notification, Report } from '../../payload-types'
import { sendPushNotificationsForEach } from './sendPushNotificationsForEach'
import { I18n } from '@payloadcms/translations'
import { I18nTFunc } from '../../types/my_types/i18n_types'
import { extractID } from '../../utilities/extractID'
import { notificationHooks } from '../../collections/paymentSchedules/hooks/notificationHooks'
import { NotificationMultiDto } from './NotificationBaseDto'
import { reports } from '../../payload-generated-schema'

export async function sendTeacherReportNotification({
  fcmTokens,
  payload,
  isModifiedNotification,
  report,
  // t,
}: {
  fcmTokens: FcmToken[]
  payload: Payload
  isModifiedNotification: boolean
  report: Report
  // t: I18n['t']
}) {
  // const _t = t as unknown as I18nTFunc
  const title = '先生からの通信' + (isModifiedNotification ? ' (更新)' : '')
  const { docs: studentDocs } = await payload.find({
    collection: 'students',
    where: {
      id: {
        in: report.students,
      },
    },
    depth: 0,
  })
  const body = report.title // push notification body will be modified title + body
  const notificationBaseDto: NotificationMultiDto = {
    title,
    body,
    fcmTokens,
    isModifiedNotification,
    users: studentDocs?.map((student) => extractID(student.parent)),
    data: {
      collectionRecordId: report.id.toString(),
      collection: 'reports',
      type: 'teacher_report',
    },
  }

  sendPushNotificationsForEach({
    notificationBaseDto,
    payload,
  })
}
