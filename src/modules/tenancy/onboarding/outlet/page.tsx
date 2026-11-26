import { OUTLET_DEFAULTS, type Weekday } from '../../collections/outlets/constants'
import { StepPage, stepMetadata } from '../components/step-page'
import { requireStep } from '../server/context'
import { OutletForm, type OutletFormValues } from './form'

/** Onboarding step 3 of 4 — the first location (guide p.23). Re-opening it edits the outlet. */
export async function OutletStepPage() {
     const { outlet } = await requireStep('outlet')
     const d = OUTLET_DEFAULTS
     const taxes = outlet?.taxes

     const initial: OutletFormValues = {
          name: outlet?.name ?? '',
          address: outlet?.address ?? '',
          vatTin: outlet?.vatTin ?? '',
          exchangeRate: outlet?.currency?.exchangeRate ?? d.exchangeRate,
          vatEnabled: taxes?.vatEnabled ?? d.vatEnabled,
          vatPercent: taxes?.vatPercent ?? d.vatPercent,
          serviceChargeEnabled: taxes?.serviceChargeEnabled ?? d.serviceChargeEnabled,
          serviceChargePercent: taxes?.serviceChargePercent ?? d.serviceChargePercent,
          lightingTaxEnabled: taxes?.lightingTaxEnabled ?? d.lightingTaxEnabled,
          lightingTaxPercent: taxes?.lightingTaxPercent ?? d.lightingTaxPercent,
          days: (outlet?.openingHours?.days as Weekday[] | null | undefined) ?? d.days,
          opens: outlet?.openingHours?.opens ?? d.opens,
          closes: outlet?.openingHours?.closes ?? d.closes,
     }

     return (
          <StepPage step={3} section="outlet">
               <OutletForm initial={initial} />
          </StepPage>
     )
}

export const outletMetadata = stepMetadata('outlet')
