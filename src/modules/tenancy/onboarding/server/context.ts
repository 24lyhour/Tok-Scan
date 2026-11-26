import 'server-only'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

import type { Organization, Outlet, Table } from '@/payload-types'
import { getServerURL } from '@/shared/config/server-url'

import { getCurrentUser } from '../../auth/server/current-user'
import { ONBOARDING_STEPS, type OnboardingStep } from '../../collections/organizations/constants'
import { relationId } from '@/shared/lib/payload'
import { onboardingRoutes, STEP_PATHS } from '../routes'

const stepIndex = (step: OnboardingStep) => ONBOARDING_STEPS.indexOf(step)

/**
 * Everything an onboarding page or action needs: the signed-in owner, their organization,
 * first outlet and its tables, and how far they got. Redirects to sign-up when signed out.
 * Cached per request.
 */
export const getOnboardingContext = cache(async () => {
     const { payload, user } = await getCurrentUser()
     if (!user) redirect(onboardingRoutes.signup)

     // The owner's organization = their first membership with orgRole "owner"
     const orgId = relationId(user.tenants?.find((t) => t.orgRole === 'owner')?.tenant)
     const organization: Organization | null = orgId
          ? await payload
                 .findByID({
                      collection: 'organizations',
                      id: orgId,
                      depth: 1,
                      overrideAccess: true,
                 })
                 .catch(() => null)
          : null

     let outlet: Outlet | null = null
     let tables: Table[] = []
     if (organization) {
          const outlets = await payload.find({
               collection: 'outlets',
               where: { tenant: { equals: organization.id } },
               sort: 'createdAt',
               limit: 1,
               depth: 0,
               overrideAccess: true,
          })
          outlet = outlets.docs[0] ?? null
     }
     if (outlet) {
          const result = await payload.find({
               collection: 'tables',
               where: { outlet: { equals: outlet.id } },
               sort: 'number',
               pagination: false,
               depth: 0,
               overrideAccess: true,
          })
          tables = result.docs
     }

     /** The furthest step this owner may open */
     const step: OnboardingStep = organization
          ? (organization.onboarding?.step ?? 'outlet')
          : 'organization'

     return { payload, user, organization, outlet, tables, step }
})

export type OnboardingContext = Awaited<ReturnType<typeof getOnboardingContext>>

/** Page guard: earlier steps can be re-opened to edit them, later steps can't be skipped to. */
export async function requireStep(page: Exclude<OnboardingStep, 'done'>) {
     const ctx = await getOnboardingContext()
     if (stepIndex(page) > stepIndex(ctx.step)) redirect(STEP_PATHS[ctx.step])
     return ctx
}

/** Step saved → the step to resume at. Editing an earlier step never moves progress back. */
export function nextStepAfter(current: OnboardingStep, saved: Exclude<OnboardingStep, 'done'>) {
     const next = ONBOARDING_STEPS[stepIndex(saved) + 1] ?? 'done'
     return stepIndex(next) > stepIndex(current) ? next : current
}

/** Public origin for links guests open (QR codes): serverURL in production, else this request's host. */
export async function getPublicOrigin(): Promise<string> {
     const fromConfig = getServerURL()
     if (fromConfig) return fromConfig
     const h = await headers()
     const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
     const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
     return `${proto}://${host}`
}
