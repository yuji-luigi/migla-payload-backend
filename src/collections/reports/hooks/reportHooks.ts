import { CollectionConfig } from 'payload'
import { teacherOperationBeforeChange } from './teacheRecordsBeforeChange'
import { sendPushNotificationAfterChangeReport } from './sendPushNotificationAfterChangeReport'
import { createReadReport } from './createReadReport'
import { deleteReadRecordFieldReport } from './deleteReadReportInResponse'

export const reportHooks: CollectionConfig<'reports'>['hooks'] = {
  beforeChange: [teacherOperationBeforeChange],
  afterChange: [sendPushNotificationAfterChangeReport],
  afterRead: [createReadReport, deleteReadRecordFieldReport],
  beforeDelete: [
    async ({ req, id, collection }) => {
      await req.payload.delete({
        collection: 'read-reports',
        where: {
          report: {
            equals: id,
          },
        },
      })
    },
  ],
}
