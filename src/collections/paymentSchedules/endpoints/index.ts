import { NotificationMultiDto } from '../../../configs/pushNotifications/NotificationBaseDto'
import { sendPushNotificationsForEach } from '../../../configs/pushNotifications/sendPushNotificationsForEach'
import { User } from '../../../payload-types'
import { extractID } from '../../../utilities/extractID'
import { Email } from './../../../blocks/Form/Email/index'
import { CollectionConfig, Endpoint, PayloadRequest } from 'payload'

export const paymentScheduleEndpoints: CollectionConfig<'payment-schedules'>['endpoints'] = [
  {
    path: '/send-payment-reminder/:id',
    method: 'post',
    handler: async (req) => {
      if (!req.routeParams?.id) {
        return Response.json({ error: 'Payment schedule ID is required' }, { status: 400 })
      }
      const id = req.routeParams.id as string
      const { docs: paymentRecords } = await req.payload.find({
        collection: 'payment-records',
        where: {
          paymentSchedule: {
            equals: id,
          },
          paid: {
            equals: false,
          },
        },
        populate: {
          users: {
            name: true,
            email: true,
            surname: true,
          },
        },
      })
      const { docs: fcmTokens } = await req.payload.find({
        collection: 'fcmTokens',
        where: {
          user: {
            in: paymentRecords.map((paymentRecord) => extractID(paymentRecord.payer)),
          },
        },
      })
      const notificationBaseDto: NotificationMultiDto = {
        title: 'お支払いのお知らせ',
        body: 'いつもありがとうございます。この度お支払いの再確認をお願い致します。',
        fcmTokens: fcmTokens,
        isModifiedNotification: false,
        users: paymentRecords.map((paymentRecord) => extractID(paymentRecord.payer)),

        data: {
          collectionRecordId: id,
          collection: 'payment-records',
          type: 'payment',
        },
      }
      sendPushNotificationsForEach({
        payload: req.payload,
        notificationBaseDto,
      })
      return Response.json({ success: true })
    },
  },
]
