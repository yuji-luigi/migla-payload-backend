import { CollectionAfterReadHook } from 'payload'
import { Report } from '../../../payload-types'

export const createReadReport: CollectionAfterReadHook<Report> = async ({
  req,
  doc,
  collection,
  context,
  findMany,
}) => {
  // change logic if teacher needs isRead
  if (req.user?.currentRole?.isParent && !findMany) {
    req.payload.create({
      collection: 'read-reports',
      data: {
        user: req.user!.id,
        report: doc.id,
      },
    })
  }
}
