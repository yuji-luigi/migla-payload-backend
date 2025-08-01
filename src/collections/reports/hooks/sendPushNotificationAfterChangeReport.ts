import { CollectionAfterChangeHook } from 'payload'
import { Report } from '../../../payload-types'
import { fcm_tokens, students, users } from '../../../payload-generated-schema'
import { eq, sql } from '@payloadcms/db-postgres/drizzle'
import { sendPushNotificationsForEach } from '../../../configs/pushNotifications/sendPushNotificationsForEach'
import { CustomTranslations } from '../../../lib/i18n/i18n_configs'
import { I18nTFunc } from '../../../types/my_types/i18n_types'
import { sendTeacherReportNotification } from '../../../configs/pushNotifications/sendTeacherReportNotification'

export const sendPushNotificationAfterChangeReport: CollectionAfterChangeHook<Report> = async ({
  req,
  doc,
  collection,
  operation,
}) => {
  const studentsIds =
    doc.students?.map((student) => student).filter((id) => typeof id === 'number') ?? []
  const { docs: students } = await req.payload.find({
    collection: 'students',
    where: {
      id: {
        in: studentsIds,
      },
    },
    depth: 0,
  })
  const { docs: fcmTokens } = await req.payload.find({
    collection: 'fcmTokens',
    where: {
      user: {
        in: students.map((student) => student.parent),
      },
    },
  })
  sendTeacherReportNotification({
    fcmTokens,
    payload: req.payload,
    isModifiedNotification: operation === 'update',
    report: doc,
    // t: req.i18n.t,
  })
  // sendPushNotificationsForEach({
  //   collection: 'reports',
  //   fcmTokens,
  //   title: (req.i18n.t as unknown as I18nTFunc)('notifications:teacherReport:title'),
  //   body: doc.title,
  //   type: 'teacher_report',
  //   payload: req.payload,
  //   isModifiedNotification: operation === 'update',
  // })
}
