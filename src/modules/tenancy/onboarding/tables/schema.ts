/** Step 4 · Tables & QR codes — Zod schema shared by the form and the server action (guide p.23). */
import { z } from 'zod'

import { TABLE_LIMITS } from '@/modules/tables'
import { numberField, requiredText, type SchemaField } from '@/shared/lib/validation'

export const tablesSchema = z.object({
     zone: requiredText(TABLE_LIMITS.zone),
     count: numberField('tableCount', 1, TABLE_LIMITS.perOutlet).refine(
          Number.isInteger,
          'tableCount',
     ),
     /** Which button was pressed: open the printable QR sheet, or finish onboarding */
     intent: z.enum(['print', 'finish']).catch('finish'),
})

export type TablesField = SchemaField<typeof tablesSchema>
