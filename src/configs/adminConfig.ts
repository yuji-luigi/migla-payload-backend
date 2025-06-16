import path from 'path'
import { Config } from 'payload'
import { Users } from '../collections/Users'

export const getAdminConfig = (dirname: string): Config['admin'] => ({
  meta: {
    title: 'MIGLA DASHBOARD',
    description: 'ミグラの管理パネルです。',
    icons: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-96x96.png',
        url: '/favicon-96x96.png',
        sizes: '96x96',
      },
      {
        rel: 'shortcut icon',
        href: '/favicon.ico',
        url: '/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
        url: '/favicon.svg',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
  },
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
    beforeDashboard: [
      '@/components/BeforeDashboard',
      {
        path: '@/components/BeforeDashboard/before_dashboard_admin_role/initialize_data_modal/InitializeDataModal.tsx',
        clientProps: {
          slug: 'initialize-data',
        },
      },
    ],
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
})
