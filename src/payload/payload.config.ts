import { mongooseAdapter } from '@payloadcms/db-mongodb'

import { buildConfig } from 'payload'
import sharp from 'sharp'

import { defaultLexical } from '@/payload/fields/defaultLexical'
import { Categories } from '@/payload/collections/Categories'
import { Media } from '@/payload/collections/Media'
import { Pages } from '@/payload/collections/Pages'
import { Posts } from '@/payload/collections/Posts'
import { Users } from '@/payload/collections/Users'
import { Footer } from '@/payload/globals/Footer/config'
import { Header } from '@/payload/globals/Header/config'

import { revalidateRedirects } from '@/payload/hooks/revalidateRedirects'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { getServerSideURL } from '@/lib/utils/getURL'

// import { fileURLToPath } from 'url'
// import path from 'path'
// const filename = fileURLToPath(import.meta.url)
// console.log('filename', filename)
// const dirname = path.dirname(filename)
// console.log('dirname', dirname)

export default buildConfig({
  admin: {
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
  typescript: {
    outputFile: 'src/payload/payload-types.ts',
  },
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
    // nestedDocsPlugin({
    //   collections: ['categories'],
    //   generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    // }),
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
