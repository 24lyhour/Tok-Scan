import { DEFAULT_BRAND_COLOR, type BrandColor } from '../../collections/organizations/constants'
import { StepPage, stepMetadata } from '../components/step-page'
import { getPublicOrigin, requireStep } from '../server/context'
import { OrganizationForm } from './form'

/** Onboarding step 2 of 4 — the business (guide p.23). Re-opening it edits the organization. */
export async function OrganizationStepPage() {
     const { organization } = await requireStep('organization')
     const host = new URL(await getPublicOrigin()).host
     const logo = organization?.logo

     return (
          <StepPage step={2} section="organization">
               <OrganizationForm
                    menuBase={`${host}/r/`}
                    initial={{
                         name: organization?.name ?? '',
                         slug: organization?.slug ?? '',
                         brandColor:
                              (organization?.brand?.primaryColor as BrandColor) ??
                              DEFAULT_BRAND_COLOR,
                         businessType: organization?.businessType ?? 'restaurant',
                         logoUrl: typeof logo === 'object' && logo?.url ? logo.url : null,
                    }}
               />
          </StepPage>
     )
}

export const organizationMetadata = stepMetadata('organization')
