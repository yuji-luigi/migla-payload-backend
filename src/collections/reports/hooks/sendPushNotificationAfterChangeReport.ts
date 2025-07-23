import { CollectionAfterChangeHook } from 'payload'
import { Report } from '../../../payload-types'
import { fcm_tokens, students, users } from '../../../payload-generated-schema'
import { eq, sql } from '@payloadcms/db-postgres/drizzle'
import { sendPushNotificationsForEach } from '../../../configs/firebase/sendPushNotificationsForEach'

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
  sendPushNotificationsForEach({
    collection: 'reports',
    fcmTokens,
    title: doc.title,
    body: doc.body.substring(0, 100),
    type: 'teacher_report',
    payload: req.payload,
    isModifiedNotification: operation === 'update',
  })
}
