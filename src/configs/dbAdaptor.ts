import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'

export const getDbAdaptor = ({ dirname }: { dirname: string }) =>
  postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  })
