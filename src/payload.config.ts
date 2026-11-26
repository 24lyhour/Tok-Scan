import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { migrations } from './migrations'
import { adminComponents, adminI18n, collections, localization, plugins, Users } from './modules'
import { getServerURL } from './shared/config/server-url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
     admin: {
          user: Users.slug,
          // tok-scan super-admin console: logo + platform overview (src/modules/platform)
          components: adminComponents,
          importMap: {
               baseDir: path.resolve(dirname),
          },
          // tok-scan branding in the admin tab (same icon files as the website, in /public)
          meta: {
               titleSuffix: '· tok·scan',
               icons: {
                    icon: [
                         { url: '/favicon.ico', sizes: '48x48' },
                         { url: '/favicon.svg', type: 'image/svg+xml' },
                    ],
                    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
               },
          },
     },
     collections,
     // Content languages (menu, receipts…): en · km · zh — src/modules/core/i18n/localization.ts
     localization,
     // Admin UI languages: en · zh — src/modules/core/i18n/admin-i18n.ts
     i18n: adminI18n,
     editor: lexicalEditor(),
     secret: process.env.PAYLOAD_SECRET || '',
     // https://tok-scan.store in production: absolute API/media/admin/email links + cookie CSRF check
     serverURL: getServerURL(),
     typescript: {
          outputFile: path.resolve(dirname, 'payload-types.ts'),
     },
     db: postgresAdapter({
          pool: {
               connectionString: process.env.DATABASE_URL || '',
          },
          // Production (Vercel) never auto-pushes the schema: pending migrations in src/migrations
          // run on start-up instead. After changing collections: `yarn payload migrate:create <name>`.
          prodMigrations: migrations,
     }),
     sharp,
     plugins,
})
