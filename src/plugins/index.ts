import { Label } from '@/components/ui/label'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { s3Storage } from '@payloadcms/storage-s3'

import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post, User } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { isAdmin, isSuperAdmin } from '../hooks/showOnlyAdmin'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  s3Storage({
    collections: {
      media: true,
    },
    bucket: process.env.S3_BUCKET || '',
    acl: 'private',
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      endpoint: process.env.S3_ENDPOINT || '',

      region: process.env.S3_REGION || '',
      // ... Other S3 configuration
    },
  }),
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      labels: {
        singular: {
          ja: 'リダイレクト',
          en: 'Redirect',
          it: 'Reindirizzamento',
        },
        plural: {
          ja: 'リダイレクト',
          en: 'Redirects',
          it: 'Reindirizzamenti',
        },
      },
      admin: {
        hidden: ({ user }) => {
          return !isAdmin(user) && !isSuperAdmin(user)
        },
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      labels: {
        singular: {
          ja: 'フォーム 送信',
          en: 'Form Submission',
          it: 'Invio Form',
        },
        plural: {
          ja: 'フォーム 送信',
          en: 'Form Submissions',
          it: 'Invii Form',
        },
      },
      admin: {
        hidden: ({ user }) => {
          return !isAdmin(user) && !isSuperAdmin(user)
        },
      },
    },
    formOverrides: {
      labels: {
        singular: {
          ja: 'フォーム',
          en: 'Form',
          it: 'Form',
        },
        plural: {
          ja: 'フォーム',
          en: 'Forms',
          it: 'Forms',
        },
      },
      admin: {
        hidden: ({ user }) => {
          return !isAdmin(user) && !isSuperAdmin(user)
        },
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      labels: {
        singular: {
          ja: '検索',
          en: 'Search',
          it: 'Ricerca',
        },
        plural: {
          ja: '検索',
          en: 'Searches',
          it: 'Ricerca',
        },
      },
      admin: {
        hidden: ({ user }) => {
          return !isAdmin(user) && !isSuperAdmin(user)
        },
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  payloadCloudPlugin({}),
]
