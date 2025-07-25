import { CollectionConfig } from 'payload'
import afterChangeNotification from '../../notifications/hooks/afterChangeHookNotification'
import { createReadNotification } from '../../notifications/hooks/afterReadHookNotification'

export const notificationHooks: CollectionConfig<'notifications'>['hooks'] = {
  afterChange: afterChangeNotification,
  beforeDelete: [
    async ({ req, id }) => {
      const { docs: readNotifications } = await req.payload.delete({
        collection: 'read-notifications',
        where: { notification: { equals: id } },
      })
    },
  ],
  afterRead: [createReadNotification],
  afterOperation: [],
}
