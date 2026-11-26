/**
 * Organizations list: the URL's search params (?status=…&q=…&page=…&org=…) → a safe query.
 * Plain values — no server code, so it is unit-tested and usable anywhere.
 */
import type { OrgStatus } from '@/modules/tenancy'

/** Tabs over the list (guide p.27). "overdue" arrives with billing; "closed" shows under All. */
export const ORG_TABS = ['all', 'active', 'trial', 'pending_approval', 'suspended'] as const
export type OrgTab = (typeof ORG_TABS)[number]

export const PAGE_SIZE = 10
export const SEARCH_MAX = 80

export type OrgQuery = {
     tab: OrgTab
     q: string
     page: number
     /** Selected organization (detail panel) */
     org: number | null
}

type Params = Record<string, string | string[] | undefined>
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export function parseOrgQuery(params: Params, fixedTab?: OrgTab): OrgQuery {
     const status = first(params.status)
     const tab =
          fixedTab ??
          ((ORG_TABS as readonly string[]).includes(status ?? '') ? (status as OrgTab) : 'all')
     const page = Number.parseInt(first(params.page) ?? '', 10)
     const org = Number.parseInt(first(params.org) ?? '', 10)
     return {
          tab,
          q: (first(params.q) ?? '').trim().slice(0, SEARCH_MAX),
          page: Number.isFinite(page) && page > 0 ? page : 1,
          org: Number.isFinite(org) && org > 0 ? org : null,
     }
}

/** URL for the same list with some values changed (tabs, pages, selecting a row). */
export function orgListHref(base: string, query: OrgQuery, change: Partial<OrgQuery>): string {
     const next = { ...query, ...change }
     const params = new URLSearchParams()
     if (next.tab !== 'all') params.set('status', next.tab)
     if (next.q) params.set('q', next.q)
     if (next.page > 1) params.set('page', String(next.page))
     if (next.org) params.set('org', String(next.org))
     const qs = params.toString()
     return qs ? `${base}?${qs}` : base
}

/** Which status changes a super-admin may make from each status. */
export const STATUS_ACTIONS: Record<OrgStatus, ('approve' | 'suspend' | 'reactivate')[]> = {
     trial: ['approve', 'suspend'],
     pending_approval: ['approve', 'suspend'],
     active: ['suspend'],
     suspended: ['reactivate'],
     closed: [],
}

export const ACTION_TARGET = {
     approve: 'active',
     suspend: 'suspended',
     reactivate: 'active',
} as const satisfies Record<string, OrgStatus>
export type StatusAction = keyof typeof ACTION_TARGET
