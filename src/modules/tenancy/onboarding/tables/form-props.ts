import 'server-only'

import { TABLE_DEFAULTS } from '@/modules/tables'

import { getPublicOrigin, maxTablesFor, type OnboardingContext } from '../server/context'

/** First-time suggestion — fits every plan */
const DEFAULT_TABLE_COUNT = 10

/** Data for <TablesForm>: plan limit, starting values and QR info. Step 4 and the app's Tables page. */
export async function tablesFormProps(ctx: OnboardingContext) {
     const { organization, tables } = ctx
     const maxTables = await maxTablesFor(ctx)
     return {
          maxTables,
          initial: {
               zone: tables[0]?.zone ?? TABLE_DEFAULTS.zone,
               count: tables.length || Math.min(DEFAULT_TABLE_COUNT, maxTables),
          },
          qr: {
               origin: await getPublicOrigin(),
               orgSlug: organization?.slug ?? '',
               keys: Object.fromEntries(tables.map((t) => [t.number, t.qrKey])),
          },
     }
}
