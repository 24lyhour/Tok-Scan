'use server'

import { redirect } from 'next/navigation'

import { newQrKey, TABLE_DEFAULTS, tableLabel } from '@/modules/tables'
import { formValues } from '@/shared/lib/validation'

import { type StepState, validate } from '../errors'
import { onboardingRoutes, STEP_PATHS } from '../routes'
import { getOnboardingContext } from '../server/context'
import { type TablesField, tablesSchema } from './schema'

/**
 * Step 4 — make tables T01…Tn for the first outlet. Existing tables keep their QR keys (printed
 * codes keep working); extra ones are removed. Then open the print sheet or finish onboarding.
 */
export async function saveTables(
     _prev: StepState<TablesField>,
     formData: FormData,
): Promise<StepState<TablesField>> {
     const { payload, organization, outlet, tables } = await getOnboardingContext()
     if (!organization) redirect(STEP_PATHS.organization)
     if (!outlet) redirect(STEP_PATHS.outlet)

     const result = validate(tablesSchema, formValues(formData))
     if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }
     const { zone, count, intent } = result.data

     try {
          const byNumber = new Map(tables.map((t) => [t.number, t]))
          for (let n = 1; n <= count; n++) {
               const existing = byNumber.get(n)
               if (!existing) {
                    await payload.create({
                         collection: 'tables',
                         data: {
                              tenant: organization.id,
                              outlet: outlet.id,
                              number: n,
                              label: tableLabel(n),
                              zone,
                              seats: TABLE_DEFAULTS.seats,
                              qrKey: newQrKey(),
                         },
                         overrideAccess: true,
                    })
               } else if (existing.zone !== zone) {
                    await payload.update({
                         collection: 'tables',
                         id: existing.id,
                         data: { zone },
                         overrideAccess: true,
                    })
               }
          }
          // Fewer tables than before → remove the extras (no orders exist yet during onboarding)
          const extra = tables.filter((t) => t.number > count).map((t) => t.id)
          if (extra.length) {
               await payload.delete({
                    collection: 'tables',
                    where: { id: { in: extra } },
                    overrideAccess: true,
               })
          }

          if (intent === 'finish') {
               await payload.update({
                    collection: 'organizations',
                    id: organization.id,
                    data: { onboarding: { step: 'done', completedAt: new Date().toISOString() } },
                    overrideAccess: true,
               })
          }
     } catch (error) {
          payload.logger.error({ err: error, msg: '[onboarding] saveTables failed' })
          return { status: 'error', formError: 'generic' }
     }

     redirect(intent === 'print' ? onboardingRoutes.printQr : STEP_PATHS.done)
}
