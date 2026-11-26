'use server'

import { redirect } from 'next/navigation'

import { formValues } from '@/shared/lib/validation'

import { type StepState, validate } from '../errors'
import { STEP_PATHS } from '../routes'
import { getOnboardingContext, nextStepAfter } from '../server/context'
import { OUTLET_LIST_FIELDS, type OutletField, outletSchema } from './schema'

/** Step 3 — create (or edit) the first outlet, then continue to tables. */
export async function saveOutlet(
     _prev: StepState<OutletField>,
     formData: FormData,
): Promise<StepState<OutletField>> {
     const ctx = await getOnboardingContext()
     const { payload, organization } = ctx
     if (!organization) redirect(STEP_PATHS.organization)

     const result = validate(outletSchema, formValues(formData, OUTLET_LIST_FIELDS))
     if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }
     const d = result.data

     const data = {
          name: d.name,
          address: d.address,
          currency: {
               primary: 'USD' as const,
               secondary: 'KHR' as const,
               exchangeRate: d.exchangeRate,
          },
          taxes: {
               vatEnabled: d.vatEnabled,
               vatPercent: d.vatPercent,
               serviceChargeEnabled: d.serviceChargeEnabled,
               serviceChargePercent: d.serviceChargePercent,
               lightingTaxEnabled: d.lightingTaxEnabled,
               lightingTaxPercent: d.lightingTaxPercent,
          },
          vatTin: d.vatTin,
          openingHours: { days: d.days, opens: d.opens, closes: d.closes },
     }

     try {
          if (ctx.outlet) {
               await payload.update({
                    collection: 'outlets',
                    id: ctx.outlet.id,
                    data,
                    overrideAccess: true,
               })
          } else {
               await payload.create({
                    collection: 'outlets',
                    data: { ...data, tenant: organization.id },
                    overrideAccess: true,
               })
          }
          await payload.update({
               collection: 'organizations',
               id: organization.id,
               data: { onboarding: { step: nextStepAfter(ctx.step, 'outlet') } },
               overrideAccess: true,
          })
     } catch (error) {
          payload.logger.error({ err: error, msg: '[onboarding] saveOutlet failed' })
          return { status: 'error', formError: 'generic' }
     }

     redirect(STEP_PATHS.tables)
}
