import { currentUserFilter } from './../../access/filters/currentUserFilterNonAdmin'
import { JobsConfig, PayloadRequest, TaskConfig } from 'payload'
import { sendScheduledPaymentNotificationQueue } from './tasks/sendScheduledPaymentNotificationQueue'
import { isAboveAdmin, isSuperAdmin } from '../../hooks/showOnlyAdmin'
import { isSubscriptionOperation } from '@apollo/client/utilities'

export const jobs: JobsConfig = {
  access: {
    run: ({ req }: { req: PayloadRequest }): boolean => {
      // Allow logged in users to execute this endpoint (default)
      console.log(req.user)
      if (req.user?.currentRole?.isAdmin || req.user?.currentRole?.isSuperAdmin) return true

      // If there is no logged in user, then check
      // for the Vercel Cron secret to be present as an
      // Authorization header:
      const authHeader = req.headers.get('authorization')
      console.log('authHeader')
      console.log(authHeader === `Bearer ${process.env.CRON_SECRET}`)
      return authHeader === `Bearer ${process.env.CRON_SECRET}`
    },
  },
  // autoRun: [
  //   {
  //     //every 5 seconds
  //     cron: '*/5 * * * * *',
  //     limit: 10, // limit jobs to process each run
  //     queue: 'every-five-seconds', // name of the queue
  //   },
  //   // add as many cron jobs as you want
  // ],
  tasks: [sendScheduledPaymentNotificationQueue],
  jobsCollectionOverrides: ({ defaultJobsCollection }) => {
    if (!defaultJobsCollection.admin) {
      defaultJobsCollection.admin = {}
    }

    defaultJobsCollection.admin.hidden = ({ user }) => {
      return !isSuperAdmin(user)
    }
    return defaultJobsCollection
  },
}
