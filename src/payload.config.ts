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
import { ReadNotification } from './collections/ReadNotification'
import { getAdminConfig } from './configs/adminConfig'
import { onInit } from './tasks/seed'
import { Providers } from './providers'
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
  admin: getAdminConfig(dirname),
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  onInit,

  collections: [
    // default collections leave here for d emo
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
    ReadNotification,
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
