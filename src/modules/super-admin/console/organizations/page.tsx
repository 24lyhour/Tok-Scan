import type { Metadata } from 'next'

import { getTranslations } from '@/i18n/server'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

import { getConsoleContext } from '../server/context'
import { loadOrganizations } from './data'
import { KpiRow } from './kpi-row'
import { OrgDetail } from './org-detail'
import { OrgTable } from './org-table'
import { orgListHref, parseOrgQuery, type OrgTab } from './query'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export async function consoleMetadata(): Promise<Metadata> {
     const { m } = await getTranslations('console')
     return { title: m.meta.title, robots: { index: false } }
}

/**
 * Organizations (guide p.27): KPI cards, status tabs + search + table, and the selected
 * restaurant's panel with Approve / Suspend. Everything is in the URL (?status, q, page, org).
 */
async function OrganizationsView({
     searchParams,
     base,
     fixedTab,
}: {
     searchParams: SearchParams
     base: string
     fixedTab?: OrgTab
}) {
     const { payload } = await getConsoleContext()
     const { m, locale } = await getTranslations('console')
     const common = (await getTranslations('common', locale)).m
     const query = parseOrgQuery(await searchParams, fixedTab)
     const data = await loadOrganizations(payload, query)

     return (
          <div className="space-y-4">
               <KpiRow kpis={data.kpis} m={m} locale={locale} />
               <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
                    <OrgTable
                         data={data}
                         query={query}
                         base={base}
                         showTabs={!fixedTab}
                         m={m}
                         soon={common.states.soon}
                         locale={locale}
                    />
                    <OrgDetail
                         org={data.selected}
                         closeHref={orgListHref(base, query, { org: null })}
                         m={m}
                         soon={common.states.soon}
                         locale={locale}
                    />
               </div>
          </div>
     )
}

/** /console/organizations — every restaurant */
export function OrganizationsPage({ searchParams }: { searchParams: SearchParams }) {
     return <OrganizationsView searchParams={searchParams} base={CONSOLE_ROUTES.organizations} />
}

/** /console/approvals — restaurants waiting for approval */
export function ApprovalsPage({ searchParams }: { searchParams: SearchParams }) {
     return (
          <OrganizationsView
               searchParams={searchParams}
               base={CONSOLE_ROUTES.approvals}
               fixedTab="pending_approval"
          />
     )
}
