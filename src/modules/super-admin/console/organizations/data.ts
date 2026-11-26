import 'server-only'

import type { Payload, Where } from 'payload'

import { ORG_STATUSES, type OrgStatus } from '@/modules/tenancy'
import type { Organization, User } from '@/payload-types'
import { relationId } from '@/shared/lib/payload'

import { ORG_TABS, PAGE_SIZE, type OrgQuery, type OrgTab } from './query'

const statusWhere = (tab: OrgTab): Where | undefined =>
     tab === 'all' ? undefined : { status: { equals: tab } }

const userOf = (value: Organization['owner'] | Organization['statusChangedBy']) =>
     typeof value === 'object' && value ? (value as User) : null

const DAY = 24 * 60 * 60 * 1000
/** Whole days since a date (null when there is none) */
const daysSince = (value?: string | null) =>
     value ? Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / DAY)) : null

/** Everything the Organizations page shows. Super-admin only — call after getConsoleContext(). */
export async function loadOrganizations(payload: Payload, query: OrgQuery) {
     const count = async (collection: 'organizations' | 'outlets' | 'tables', where?: Where) =>
          (await payload.count({ collection, where, overrideAccess: true })).totalDocs

     const monthStart = new Date()
     monthStart.setDate(1)
     monthStart.setHours(0, 0, 0, 0)

     const search: Where | undefined = query.q
          ? {
                 or: [
                      { name: { like: query.q } },
                      { slug: { like: query.q } },
                      { 'owner.email': { like: query.q } },
                 ],
            }
          : undefined
     const filters = [statusWhere(query.tab), search].filter(Boolean) as Where[]

     const [tabCounts, activeThisMonth, outletsLive, oldestPending, list] = await Promise.all([
          Promise.all(ORG_TABS.map((tab) => count('organizations', statusWhere(tab)))),
          count('organizations', {
               and: [
                    { status: { equals: 'active' } },
                    { createdAt: { greater_than_equal: monthStart.toISOString() } },
               ],
          }),
          count('outlets', { 'tenant.status': { equals: 'active' } }),
          payload.find({
               collection: 'organizations',
               where: { status: { equals: 'pending_approval' } },
               sort: 'createdAt',
               limit: 1,
               depth: 0,
               overrideAccess: true,
          }),
          payload.find({
               collection: 'organizations',
               where: filters.length ? { and: filters } : undefined,
               sort: '-createdAt',
               page: query.page,
               limit: PAGE_SIZE,
               depth: 1,
               overrideAccess: true,
          }),
     ])

     // Outlets per listed organization — one query for the whole page
     const ids = list.docs.map((o) => o.id)
     const outletDocs = ids.length
          ? await payload.find({
                 collection: 'outlets',
                 where: { tenant: { in: ids } },
                 pagination: false,
                 depth: 0,
                 select: { tenant: true },
                 overrideAccess: true,
            })
          : { docs: [] }
     const outletsByOrg = new Map<number, number>()
     for (const o of outletDocs.docs) {
          const id = relationId(o.tenant)
          if (id) outletsByOrg.set(id, (outletsByOrg.get(id) ?? 0) + 1)
     }

     const counts = Object.fromEntries(
          ORG_TABS.map((tab, i) => [tab, tabCounts[i] ?? 0]),
     ) as Record<OrgTab, number>

     return {
          counts,
          kpis: {
               active: counts.active,
               activeThisMonth,
               outletsLive,
               pending: counts.pending_approval,
               oldestPendingDays: daysSince(oldestPending.docs[0]?.createdAt),
          },
          rows: list.docs.map((o) => ({
               id: o.id,
               name: o.name,
               slug: o.slug,
               color: o.brand?.primaryColor ?? null,
               ownerEmail: userOf(o.owner)?.email ?? '—',
               status: (ORG_STATUSES as readonly string[]).includes(o.status ?? '')
                    ? (o.status as OrgStatus)
                    : null,
               outlets: outletsByOrg.get(o.id) ?? 0,
               createdAt: o.createdAt,
          })),
          page: list.page ?? 1,
          totalPages: list.totalPages,
          total: list.totalDocs,
          selected: query.org ? await loadDetail(payload, query.org) : null,
     }
}

/** The right-hand panel for one organization. */
async function loadDetail(payload: Payload, id: number) {
     const org = await payload
          .findByID({ collection: 'organizations', id, depth: 1, overrideAccess: true })
          .catch(() => null)
     if (!org) return null
     const [outlets, tables] = await Promise.all([
          payload.count({
               collection: 'outlets',
               where: { tenant: { equals: id } },
               overrideAccess: true,
          }),
          payload.count({
               collection: 'tables',
               where: { tenant: { equals: id } },
               overrideAccess: true,
          }),
     ])
     const owner = userOf(org.owner)
     const changedBy = userOf(org.statusChangedBy)
     return {
          id: org.id,
          name: org.name,
          slug: org.slug,
          color: org.brand?.primaryColor ?? null,
          status: (org.status ?? 'trial') as OrgStatus,
          ownerName: owner?.name || owner?.email || '—',
          outlets: outlets.totalDocs,
          tables: tables.totalDocs,
          createdAt: org.createdAt,
          trialEndsAt: org.trialEndsAt ?? null,
          statusChangedAt: org.statusChangedAt ?? null,
          statusChangedBy: changedBy?.name || changedBy?.email || null,
     }
}

export type OrganizationsData = Awaited<ReturnType<typeof loadOrganizations>>
export type OrgRow = OrganizationsData['rows'][number]
export type OrgDetail = NonNullable<OrganizationsData['selected']>
