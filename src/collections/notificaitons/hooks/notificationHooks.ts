import { CollectionConfig } from 'payload'
import afterChangeNotification from './afterChangeHookNotification'

export const notificationHooks: CollectionConfig<'notifications'>['hooks'] = {
  afterChange: afterChangeNotification,
}
