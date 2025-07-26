import { JobsConfig, PayloadRequest, TaskConfig } from 'payload'
import { sendPaymentScheduleNotification } from './tasks/sendPaymentScheduleNotification'
import { isAboveAdmin, isSuperAdmin } from '../../hooks/showOnlyAdmin'
import { isSubscriptionOperation } from '@apollo/client/utilities'

export const jobs: JobsConfig = {
  access: {
    run: ({ req }: { req: PayloadRequest }): boolean => {
      // Allow logged in users to execute this endpoint (default)
      if (req.user) return true

      // If there is no logged in user, then check
      // for the Vercel Cron secret to be present as an
      // Authorization header:
      const authHeader = req.headers.get('authorization')
      return authHeader === `Bearer ${process.env.CRON_SECRET}`
    },
  },
  autoRun: [
    {
      //every 5 seconds
      cron: '*/5 * * * * *',
      limit: 10, // limit jobs to process each run
      queue: 'every-five-seconds', // name of the queue
    },
    // add as many cron jobs as you want
  ],
  tasks: [sendPaymentScheduleNotification],
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
