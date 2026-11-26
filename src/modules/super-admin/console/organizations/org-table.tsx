import { Download, EllipsisVertical } from 'lucide-react'
import Link from 'next/link'

import type { ConsoleContent } from '@/i18n/messages'
import {
     TableCard,
     TablePagination,
     TableSearch,
     TableTabs,
     TableToolButton,
     TokScanTable,
     type TableColumn,
} from '@/shared/components/tok-scan-table'
import { OrgAvatar } from '@/shared/components/ui/org-avatar'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'
import { formatMonth, localizeDigits } from '@/shared/i18n/format'
import type { Locale } from '@/shared/i18n/locales'

import type { OrganizationsData, OrgRow } from './data'
import { OrgStatusPill } from './org-status'
import { ORG_TABS, orgListHref, PAGE_SIZE, SEARCH_MAX, type OrgQuery } from './query'

const isToday = (value: string) => new Date(value).toDateString() === new Date().toDateString()

/** Organizations list (guide p.27, left card) — built from the shared tok-scan table. */
export function OrgTable({
     data,
     query,
     base,
     showTabs,
     m,
     soon,
     locale,
}: {
     data: OrganizationsData
     query: OrgQuery
     /** Page URL (/console/organizations or /console/approvals) */
     base: string
     showTabs: boolean
     m: ConsoleContent
     soon: string
     locale: Locale
}) {
     const n = (value: number) => localizeDigits(value, locale)
     const href = (change: Partial<OrgQuery>) => orgListHref(base, query, change)

     const columns: TableColumn<OrgRow>[] = [
          {
               id: 'organization',
               header: m.table.organization,
               cell: (row) => (
                    <Link
                         href={href({ org: row.id })}
                         scroll={false}
                         className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-brand-300"
                    >
                         <OrgAvatar name={row.name} color={row.color} />
                         <span className="min-w-0">
                              <span className="block truncate font-semibold text-ink">
                                   {row.name}
                              </span>
                              <span className="block truncate text-xs text-ink-3">
                                   {row.ownerEmail}
                              </span>
                         </span>
                    </Link>
               ),
          },
          {
               id: 'plan',
               header: m.table.plan,
               cell: () => (
                    <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-ink-2">
                         {m.table.trialPlan}
                    </span>
               ),
          },
          {
               id: 'outlets',
               header: m.table.outlets,
               align: 'right',
               className: 'font-medium',
               cell: (row) => n(row.outlets),
          },
          {
               id: 'status',
               header: m.table.status,
               cell: (row) =>
                    row.status && (
                         <OrgStatusPill status={row.status} label={m.status[row.status]} />
                    ),
          },
          {
               id: 'gmv',
               header: m.table.gmv,
               align: 'right',
               className: 'text-ink-3',
               cell: () => '—',
          },
          {
               id: 'since',
               header: m.table.since,
               className: 'whitespace-nowrap text-ink-2',
               cell: (row) =>
                    isToday(row.createdAt) ? m.table.today : formatMonth(row.createdAt, locale),
          },
          {
               id: 'more',
               header: m.table.more,
               srOnlyHeader: true,
               className: 'w-10 px-2',
               cell: (row) => (
                    <a
                         href={`${CONSOLE_ROUTES.dataAdmin}/collections/organizations/${row.id}`}
                         title={m.table.more}
                         aria-label={`${m.table.more}: ${row.name}`}
                         className="flex size-8 items-center justify-center rounded-lg text-ink-3 hover:bg-paper hover:text-ink"
                    >
                         <EllipsisVertical aria-hidden className="size-4" />
                    </a>
               ),
          },
     ]

     return (
          <TableCard>
               {showTabs && (
                    <TableTabs
                         label={m.table.status}
                         active={query.tab}
                         soonLabel={soon}
                         tabs={[
                              ...ORG_TABS.map((tab) => ({
                                   id: tab,
                                   label: m.tabs[tab],
                                   count: n(data.counts[tab]),
                                   href: href({ tab, page: 1, org: null }),
                              })),
                              { id: 'overdue', label: m.tabs.overdue },
                         ]}
                    />
               )}
               <TableSearch
                    action={base}
                    placeholder={m.filters.search}
                    defaultValue={query.q}
                    maxLength={SEARCH_MAX}
                    keep={{ status: showTabs && query.tab !== 'all' ? query.tab : undefined }}
               >
                    <TableToolButton disabled title={soon}>
                         {m.filters.plan}
                    </TableToolButton>
                    <TableToolButton disabled title={soon}>
                         <Download aria-hidden className="size-4" />
                         {m.filters.csv}
                    </TableToolButton>
               </TableSearch>
               <TokScanTable
                    columns={columns}
                    rows={data.rows}
                    rowKey={(row) => row.id}
                    isSelected={(row) => row.id === query.org}
                    empty={m.table.empty}
               />
               <TablePagination
                    page={data.page}
                    totalPages={data.totalPages}
                    total={data.total}
                    pageSize={PAGE_SIZE}
                    hrefFor={(page) => href({ page, org: null })}
                    labels={m.table}
                    locale={locale}
               />
          </TableCard>
     )
}
