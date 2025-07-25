import { CollectionAfterChangeHook } from 'payload'
import { extractID } from '../../../utilities/extractID'
import { PaymentSchedule } from '../../../payload-types'

/**
 * @description When a payment schedule is created, this hook will:
 * 1. Find all classrooms
 * 2. Find all students in those classrooms
 * 3. Find all parents of those students
 * 4. Eliminate duplicated parents
 * 5. Create payment records for each parent with the schedule's fee information
 */
export const queueSendNotification: CollectionAfterChangeHook<PaymentSchedule> = async ({
  req,
  operation,
  doc,
}) => {
  // setImmediate(async () => {
  if (operation === 'update') {
    // await req.payload.jobs.cancel({
    //   // queue: 'every-second',
    //   where: {
    //     // look inside the JSONB `input` column for the key "paymentScheduleId"
    //     'input.paymentScheduleId': {
    //       equals: doc.id,
    //     },
    //     // (optionally scoping it to your particular task)
    //     taskSlug: {
    //       equals: 'sendScheduledPaymentNotification',
    //     },
    //   },
    // })
    // await req.payload.delete({
    //   collection: 'payload-jobs',
    //   where: {
    //     'input.paymentScheduleId': {
    //       equals: doc.id,
    //     },
    //   },
    // })
  }
  if (operation === 'create' || operation === 'update') {
    await req.payload.jobs.queue({
      task: 'sendScheduledPaymentNotification',
      queue: 'every-five-seconds',
      waitUntil: new Date(doc.notificationScheduledAt),
      input: {
        paymentScheduleId: doc.id,
      },
    })
  }
  // })
}
