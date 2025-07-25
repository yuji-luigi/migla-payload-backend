import { TaskConfig } from 'payload'
import { sendPushNotificationsForEach } from '../../pushNotifications/sendPushNotificationsForEach'

export const sendPaymentScheduleNotification: TaskConfig<'sendScheduledPaymentNotification'> = {
  slug: 'sendScheduledPaymentNotification',
  retries: 1,
  inputSchema: [
    {
      name: 'paymentScheduleId',
      type: 'number',
    },
  ],
  outputSchema: [
    {
      name: 'success',
      type: 'checkbox',
    },
  ],
  onFail: () => {
    console.log('onFail')
  },
  onSuccess: () => {
    console.log('onSuccess')
  },
  handler: async ({ input, job, req }) => {
    console.log('sendPaymentScheduleNotification', input, job, req)

    if (!input.paymentScheduleId) {
      throw new Error('paymentScheduleId is required')
    }

    try {
      // Step 1: Find all payment records for the given payment schedule
      const { docs: paymentRecords } = await req.payload.find({
        collection: 'payment-records',
        where: {
          paymentSchedule: {
            equals: input.paymentScheduleId,
          },
        },
        depth: 0, // We only need the basic fields
      })

      console.log(
        `Found ${paymentRecords.length} payment records for schedule ${input.paymentScheduleId}`,
      )

      if (paymentRecords.length === 0) {
        console.log('No payment records found for this schedule')
        return {
          output: { success: true },
        }
      }

      // Step 2: Extract unique payer IDs from payment records
      // not necessary
      const payerIds = [...new Set(paymentRecords.map((record) => record.payer))].filter(
        (id): id is number => typeof id === 'number',
      )

      console.log(`Found ${payerIds.length} unique payers`)

      if (payerIds.length === 0) {
        console.log('No valid payer IDs found')
        return {
          output: { success: true },
        }
      }

      // Step 3: Find all FCM tokens for these payers
      const { docs: fcmTokens } = await req.payload.find({
        collection: 'fcmTokens',
        where: {
          user: {
            in: payerIds,
          },
        },
        depth: 0,
      })

      console.log(`Found ${fcmTokens.length} FCM tokens for payers`)

      // Step 4: Get the payment schedule details for notification content
      const paymentSchedule = await req.payload.findByID({
        collection: 'payment-schedules',
        id: input.paymentScheduleId,
      })

      console.log('Payment schedule details:', {
        name: paymentSchedule.name,
        notificationTitle: paymentSchedule.notificationTitle,
        notificationBody: paymentSchedule.notificationBody,
      })

      // TODO: Send push notifications using the FCM tokens
      // You can use the sendPushNotificationsForEach function here
      // or implement your own notification sending logic
      sendPushNotificationsForEach({
        payload: req.payload,
        fcmTokens,
        title: 'Payment Reminder',
        body: 'Payment Reminder',
        collection: 'payment-records',
        type: 'payment',
        isModifiedNotification: false,
      })
      return {
        output: {
          success: true,
          paymentRecordsCount: paymentRecords.length,
          payerIdsCount: payerIds.length,
          fcmTokensCount: fcmTokens.length,
        },
      }
    } catch (error) {
      console.error('Error in sendPaymentScheduleNotification handler:', error)
      throw error
    }
  },
} as TaskConfig<'sendScheduledPaymentNotification'>
