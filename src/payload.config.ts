// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import sharp from 'sharp' // sharp-import
import { fileURLToPath } from 'url'

import { defaultLexical } from '@/fields/defaultLexical'
import { Categories } from './collections/Categories'
import { Classrooms } from './collections/Classrooms'
import { Homeworks } from './collections/Homeworks'
import { Media } from './collections/Media'
import { Notifications } from './collections/Notifications'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Reports } from './collections/Reports'
import { Roles } from './collections/Roles'
import { Settings } from './collections/Settings'
import { Students } from './collections/students/Students'
import { Teachers } from './collections/Teachers'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { CustomTranslations, CustomTranslationsKeys, i18nConfigs } from './lib/i18n/i18n_configs'
import { LogoGlobal } from './LogoGlobal/config'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// // 1. Point at your icons folder
// const iconsDir = path.join(dirname, '../public', 'icons', 'file_icons')
// // 2. Read all the SVG filenames
// const svgFiles = fs.readdirSync(iconsDir).filter((f) => f.endsWith('.svg'))

// fs.writeFileSync(
//   path.join(dirname, 'components', 'ui', 'file_preview', 'file_icons', 'existing_file_icons.ts'),
//   `// you can generate this file uncommenting the payload.config.ts file. Search for "generate the icon files"
//   export const existingFileIcons = [${svgFiles.map((f) => `'${f}'`).join(', ')}] as const`,
// )

export default buildConfig({
  i18n: i18nConfigs,
  localization: {
    defaultLocale: 'ja',
    locales: ['ja', 'en', 'it'],
    fallback: true,
  },
  auth: {
    jwtOrder: ['Bearer', 'cookie'],
  },
  graphQL: {},
  admin: {
    components: {
      // header: ['@/components/Header'],
      // afterNavLinks: ['@/components/AfterNavLinks'],
      actions: ['@/components/Actions'],
      views: {
        importPage: {
          path: '/import',
          Component: '@/components/views/ImportPage', // just an example of how to create custom routes with payload props passed in to the page
        },
      },

      graphics: {
        Logo: '@/components/Logo/LogoServer',
        Icon: '@/components/Icon',
      },
      logout: {
        // Button: '@/components/LogoutButton',
      },
      // actions: ['@/components/ActionsExample/CustomAction'],

      afterLogin: ['@/components/AfterLogin'],

      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
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
