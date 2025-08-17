// src/graphql/queries/paymentRecordsToNotify/resolver.ts
import type { PayloadRequest } from 'payload'

type Args = {
  payerId?: unknown
  now?: string
  unpaidOnly?: boolean
  page?: number
  limit?: number
}

// Return the exact shape Payload’s paginated list expects
export default async function paymentRecordsToNotify(
  _obj: unknown,
  args: Args,
  context: { req: PayloadRequest },
) {
  const { req } = context
  const { payload } = req

  const nowISO = args.now ?? new Date().toISOString()
  const page = args.page ?? 1
  const limit = args.limit ?? 25
  const unpaidOnly = args.unpaidOnly ?? false

  // 1) Find all schedules with notificationScheduledAt <= now
  const schedules = await payload.find({
    collection: 'payment-schedules',
    where: {
      notificationScheduledAt: { less_than_equal: nowISO },
    },
    // Important to respect access & user context:
    overrideAccess: false,
    user: req.user,
    limit: 0, // return all (no pagination)
    depth: 0, // return raw docs; GraphQL will resolve later
  })

  const scheduleIds = schedules.docs.map((d) => d.id)
  if (scheduleIds.length === 0) {
    // Return an empty, valid paginated response
    return {
      docs: [],
      totalDocs: 0,
      totalPages: 0,
      page,
      limit,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }

  // 2) Find payment-records that match payer + schedule + (optional) unpaid
  const and: any[] = [{ paymentSchedule: { in: scheduleIds } }]
  if (args.payerId != null) and.push({ payer: { equals: args.payerId } })
  if (unpaidOnly) and.push({ paid: { equals: false } })

  const records = await payload.find({
    collection: 'payment-records',
    where: { and },
    page,
    limit,
    overrideAccess: false,
    user: req.user,
    depth: 0, // let GraphQL resolve relationships per selection set
  })

  // Return as-is; the GraphQL layer will shape it to the paginated type
  return records
}
