// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Roles } from './collections/Roles'
import { Students } from './collections/Students'
import { Classrooms } from './collections/Classrooms'
import { Teachers } from './collections/Teachers'
import { Homeworks } from './collections/Homeworks'
import { Notifications } from './collections/Notifications'
import { Reports } from './collections/Reports'
import { Settings } from './collections/Settings'
import { LogoGlobal } from './LogoGlobal/config'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { i18nConfigs } from './lib/i18n/i18n_configs'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: i18nConfigs,
  auth: {
    jwtOrder: ['Bearer', 'cookie'],
  },
  admin: {
    components: {
      logout: {
        // Button: '@/components/LogoutButton',
      },
      // actions: ['@/components/ActionsExample/CustomAction'],
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      // beforeLogin: ['@/components/BeforeLogin/CustomLogin'],
      afterLogin: ['@/components/AfterLogin'],
      views: {},
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      // beforeDashboard: ['@/components/BeforeDashboard'],
    },

    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [
    // default collections leave here for demo
    Pages,
    Posts,
    Categories,
    // used collections
    Users,
    Teachers,
    Students,
    Reports,
    Classrooms,
    Notifications,
    Homeworks,
    Media,
    Roles,
    Settings,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, LogoGlobal],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
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
    tasks: [],
  },
})
