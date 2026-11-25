import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { adminI18n, collections, localization, Users } from './modules'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
     admin: {
          user: Users.slug,
          importMap: {
               baseDir: path.resolve(dirname),
          },
     },
     collections,
     // Content languages (menu, receipts…): en · km · zh — src/modules/core/i18n/localization.ts
     localization,
     // Admin UI languages: en · zh — src/modules/core/i18n/admin-i18n.ts
     i18n: adminI18n,
     editor: lexicalEditor(),
     secret: process.env.PAYLOAD_SECRET || '',
     typescript: {
          outputFile: path.resolve(dirname, 'payload-types.ts'),
     },
     db: postgresAdapter({
          pool: {
               connectionString: process.env.DATABASE_URL || '',
          },
     }),
     sharp,
     plugins: [],
})
