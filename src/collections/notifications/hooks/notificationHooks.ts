import { CollectionConfig } from 'payload'
import afterChangeNotification from './afterChangeHookNotification'
import { createReadNotification } from './afterReadHookNotification'

export const notificationHooks: CollectionConfig<'notifications'>['hooks'] = {
  afterChange: afterChangeNotification,
  afterRead: [createReadNotification],
}
