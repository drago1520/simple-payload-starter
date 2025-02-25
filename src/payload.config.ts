import { mongooseAdapter } from '@payloadcms/db-mongodb'

import { buildConfig } from 'payload'
import sharp from 'sharp'

import { defaultLexical } from '@/fields/defaultLexical'
import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Posts } from '@/collections/Posts'
import { Users } from '@/collections/Users'
import { Footer } from '@/components/Footer/config'
import { Header } from '@/components/Header/config'

import { revalidateRedirects } from '@/lib/hooks/revalidateRedirects'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { getServerSideURL } from '@/lib/utilities/getURL'

// const filename = fileURLToPath(import.meta.url)
// console.log('filename', filename)
// const dirname = path.dirname(filename)
// console.log('dirname', dirname)

export default buildConfig({
  admin: {
    // components: {
    //   beforeLogin: ['@/components/BeforeLogin'],
    //   beforeDashboard: ['@/components/BeforeDashboard'],
    // },
    // importMap: {
    //   baseDir: path.resolve(dirname),
    // },
    // user: Users.slug,
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
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [Users, Media, Pages, Posts, Categories],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  // typescript: {
  //   outputFile: path.resolve(dirname, 'payload-types.ts'),
  // },
  plugins: [
    // storage-adapter-placeholder,
    redirectsPlugin({
      collections: ['pages', 'posts'],
      overrides: {
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
      generateTitle: ({ doc }) => {
        return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
      },
      generateURL: ({ doc }) => {
        const url = getServerSideURL()
        return doc?.slug ? `${url}/${doc.slug}` : url
      },
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
      },
      formOverrides: {
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
    payloadCloudPlugin(),
  ],
})
