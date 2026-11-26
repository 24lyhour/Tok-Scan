import 'server-only'

import { redirect } from 'next/navigation'
import { cache } from 'react'

import { limitsFor } from '@/modules/core'
import { orgIdsWithRole, type OrgRole } from '@/modules/core/payload'
import {
     canPrintQr,
     DEFAULT_BRAND_COLOR,
     getOnboardingContext,
     goLiveRows,
     onboardingRoutes,
} from '@/modules/tenancy'
import { relationId } from '@/shared/lib/payload'

/**
 * Everything the signed-in app shell needs: the owner, the current organization and outlet,
 * the other organizations/outlets for the switcher, plan limits and the go-live checklist.
 * Owners who haven't finished onboarding are sent back to their step. Cached per request.
 */
export const getWorkspaceContext = cache(async () => {
     const ctx = await getOnboardingContext()
     const { payload, user, organization, outlet } = ctx
     if (ctx.step !== 'done' || !organization || !outlet) redirect(onboardingRoutes.resume)

     const roleIn = (orgId: number) =>
          (user.tenants?.find((t) => relationId(t.tenant) === orgId)?.orgRole ??
               'member') as OrgRole
     const count = async (collection: 'outlets' | 'tables', where: object) =>
          (await payload.count({ collection, where: where as never, overrideAccess: true }))
               .totalDocs

     // Independent lookups run together (each is a database round trip)
     const [orgDocs, outletDocs] = await Promise.all([
          payload.find({
               collection: 'organizations',
               where: { id: { in: orgIdsWithRole(user) } },
               sort: 'name',
               depth: 0,
               pagination: false,
               overrideAccess: true,
          }),
          payload.find({
               collection: 'outlets',
               where: { tenant: { equals: organization.id } },
               sort: 'createdAt',
               depth: 0,
               pagination: false,
               overrideAccess: true,
          }),
     ])
     const [organizations, outlets] = await Promise.all([
          Promise.all(
               orgDocs.docs.map(async (org) => ({
                    id: org.id,
                    name: org.name,
                    color: org.brand?.primaryColor ?? DEFAULT_BRAND_COLOR,
                    role: roleIn(org.id),
                    // The current organization's outlets are already loaded
                    outlets:
                         org.id === organization.id
                              ? outletDocs.docs.length
                              : await count('outlets', { tenant: { equals: org.id } }),
                    current: org.id === organization.id,
               })),
          ),
          Promise.all(
               outletDocs.docs.map(async (o) => ({
                    id: o.id,
                    name: o.name,
                    // The current outlet's tables are already loaded by the onboarding context
                    tables:
                         o.id === outlet.id
                              ? ctx.tables.length
                              : await count('tables', { outlet: { equals: o.id } }),
                    current: o.id === outlet.id,
               })),
          ),
     ])

     const rows = goLiveRows(ctx)
     return {
          ...ctx,
          organization,
          outlet,
          role: roleIn(organization.id),
          organizations,
          outlets,
          plan: { limits: limitsFor(organization) },
          rows,
          qrUnlocked: canPrintQr(rows),
     }
})

export type WorkspaceContext = Awaited<ReturnType<typeof getWorkspaceContext>>
