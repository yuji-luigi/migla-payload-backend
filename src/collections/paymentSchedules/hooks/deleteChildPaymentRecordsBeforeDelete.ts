import { CollectionBeforeDeleteHook } from 'payload'

export const deleteChildPaymentRecordsBeforeDelete: CollectionBeforeDeleteHook = async ({
  req,
  id,
  collection,
}) => {
  await req.payload.delete({
    collection: 'payment-records',
    where: {
      paymentSchedule: { equals: id },
    },
  })
}
