/** Step 4 · Tables & QR codes — Zod schema shared by the form and the server action (guide p.23). */
import { z } from 'zod'

import { TABLE_DEFAULTS, TABLE_LIMITS } from '@/modules/tables'
import { numberField, optionalText, type SchemaField } from '@/shared/lib/validation'

export const tablesSchema = z.object({
     /** Optional — left empty, the tables go in "Indoor" */
     zone: optionalText(TABLE_LIMITS.zone).transform((zone) => zone || TABLE_DEFAULTS.zone),
     count: numberField('tableCount', 1, TABLE_LIMITS.perOutlet).refine(
          Number.isInteger,
          'tableCount',
     ),
})

export type TablesField = SchemaField<typeof tablesSchema>
