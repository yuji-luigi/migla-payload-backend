import { CollectionAfterReadHook } from 'payload'
import { Report } from '../../../payload-types'

export const deleteReadRecordFieldReport: CollectionAfterReadHook<Report> = async ({
  req,
  doc,
  collection,
  context,
  findMany,
}) => {
  doc.readRecords = undefined
}
