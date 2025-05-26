import { mongooseAdapter } from '@payloadcms/db-mongodb';

import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Categories } from '@/payload/collections/Categories';
import { Media } from '@/payload/collections/Media';
import { Pages } from '@/payload/collections/Pages';
import { Posts } from '@/payload/collections/Posts';
import { Users } from '@/payload/collections/Users';
import { defaultLexical } from '@/payload/fields/defaultLexical';
import { Footer } from '@/payload/globals/Footer/config';
import { Header } from '@/payload/globals/Header/config';

import { getServerSideURL } from '@/lib/utils/getURL';
import { plugins } from './payload/plugins';

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
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
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [Users, Media, Pages, Posts, Categories],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: 'src/payload-types.ts',
  },
  plugins: [...plugins],
});
