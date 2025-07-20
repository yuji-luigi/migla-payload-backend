import { CollectionConfig } from 'payload'
import { teacherOperationBeforeChange } from './teacheRecordsBeforeChange'
import { sendPushNotificationAfterChangeReport } from './sendPushNotificationAfterChangeReport'

export const reportHooks: CollectionConfig<'reports'>['hooks'] = {
  beforeChange: [teacherOperationBeforeChange],
  afterChange: [sendPushNotificationAfterChangeReport],
}
