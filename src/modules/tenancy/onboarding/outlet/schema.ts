/** Step 3 · First outlet — Zod schema shared by the form and the server action (guide p.23). */
import { z } from 'zod'

import {
     numberField,
     optionalText,
     requiredText,
     switchField,
     type SchemaField,
} from '@/shared/lib/validation'

import { OUTLET_LIMITS, WEEKDAYS } from '../../collections/outlets/constants'

const percent = numberField('percent', 0, 100).transform((n) => Math.round(n * 100) / 100)
const time = z.string('time').regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'time')

export const outletSchema = z.object({
     name: requiredText(OUTLET_LIMITS.name),
     address: optionalText(OUTLET_LIMITS.address),
     exchangeRate: numberField('number', 1000, 10000).transform(Math.round),
     vatEnabled: switchField(),
     vatPercent: percent,
     serviceChargeEnabled: switchField(),
     serviceChargePercent: percent,
     lightingTaxEnabled: switchField(),
     lightingTaxPercent: percent,
     vatTin: optionalText(OUTLET_LIMITS.vatTin),
     days: z.array(z.enum(WEEKDAYS, 'days')).min(1, 'days'),
     opens: time,
     closes: time,
})

/** Multi-value fields (read with formData.getAll) */
export const OUTLET_LIST_FIELDS = ['days'] as const

export type OutletField = SchemaField<typeof outletSchema>
