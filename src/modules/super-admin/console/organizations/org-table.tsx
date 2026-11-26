import { ChevronLeft, ChevronRight, Download, EllipsisVertical, Search } from 'lucide-react'
import Link from 'next/link'

import { OrgAvatar } from '@/shared/components/ui/org-avatar'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'
import { formatMonth, interpolate, localizeDigits } from '@/shared/i18n/format'
import type { Locale } from '@/shared/i18n/locales'
import { cn } from '@/shared/lib/utils'

import type { ConsoleContent } from '@/i18n/messages'
import type { OrganizationsData } from './data'
import { OrgStatusPill } from './org-status'
import { ORG_TABS, orgListHref, PAGE_SIZE, SEARCH_MAX, type OrgQuery } from './query'

const isToday = (value: string) => new Date(value).toDateString() === new Date().toDateString()

/** Status tabs, search and the organizations table with pages (guide p.27, left card). */
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
     const from = data.total ? (data.page - 1) * PAGE_SIZE + 1 : 0
     const to = Math.min(data.page * PAGE_SIZE, data.total)

     return (
          <section className="min-w-0 overflow-hidden rounded-2xl border border-line bg-white">
               {showTabs && (
                    <nav
                         aria-label={m.table.status}
                         className="flex gap-1 overflow-x-auto border-b border-line px-3"
                    >
                         {ORG_TABS.map((tab) => {
                              const active = query.tab === tab
                              return (
                                   <Link
                                        key={tab}
                                        href={href({ tab, page: 1, org: null })}
                                        aria-current={active ? 'page' : undefined}
                                        className={cn(
                                             '-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-3 text-sm whitespace-nowrap',
                                             active
                                                  ? 'border-brand-700 font-semibold text-ink'
                                                  : 'border-transparent text-ink-2 hover:text-ink',
                                        )}
                                   >
                                        {m.tabs[tab]}
                                        <span
                                             className={cn(
                                                  'tabular rounded-full px-1.5 text-xs font-semibold',
                                                  active
                                                       ? 'bg-brand-700 text-white'
                                                       : 'bg-paper text-ink-3',
                                             )}
                                        >
                                             {n(data.counts[tab])}
                                        </span>
                                   </Link>
                              )
                         })}
                         <span
                              title={soon}
                              aria-disabled="true"
                              className="flex shrink-0 cursor-not-allowed items-center gap-1.5 px-2.5 py-3 text-sm whitespace-nowrap text-ink-3"
                         >
                              {m.tabs.overdue}
                              <span className="rounded-full bg-paper px-1.5 text-[0.625rem] font-semibold">
                                   {soon}
                              </span>
                         </span>
                    </nav>
               )}

               {/* Search — a plain GET form, so the URL holds the filter */}
               <form action={base} className="flex flex-wrap items-center gap-2 p-3">
                    {query.tab !== 'all' && showTabs && (
                         <input type="hidden" name="status" value={query.tab} />
                    )}
                    <label className="relative min-w-48 flex-1">
                         <span className="sr-only">{m.filters.search}</span>
                         <Search
                              aria-hidden
                              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3"
                         />
                         <input
                              type="search"
                              name="q"
                              defaultValue={query.q}
                              maxLength={SEARCH_MAX}
                              placeholder={m.filters.search}
                              className="h-10 w-full rounded-xl border border-line bg-white pr-3 pl-9 text-sm outline-none placeholder:text-ink-3 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15"
                         />
                    </label>
                    <button
                         type="button"
                         disabled
                         title={soon}
                         className="h-10 cursor-not-allowed rounded-xl border border-line px-3 text-sm font-medium text-ink-2"
                    >
                         {m.filters.plan}
                    </button>
                    <button
                         type="button"
                         disabled
                         title={soon}
                         className="flex h-10 cursor-not-allowed items-center gap-1.5 rounded-xl border border-line px-3 text-sm font-medium text-ink-2"
                    >
                         <Download aria-hidden className="size-4" />
                         {m.filters.csv}
                    </button>
               </form>

               <div className="overflow-x-auto">
                    <table className="w-full min-w-[44rem] text-sm">
                         <thead>
                              <tr className="border-y border-line bg-paper/60 text-left text-[0.6875rem] font-semibold tracking-[0.08em] text-ink-3 uppercase">
                                   <th className="px-4 py-2.5">{m.table.organization}</th>
                                   <th className="px-3 py-2.5">{m.table.plan}</th>
                                   <th className="px-3 py-2.5 text-right">{m.table.outlets}</th>
                                   <th className="px-3 py-2.5">{m.table.status}</th>
                                   <th className="px-3 py-2.5 text-right">{m.table.gmv}</th>
                                   <th className="px-3 py-2.5">{m.table.since}</th>
                                   <th className="w-10 px-2 py-2.5">
                                        <span className="sr-only">{m.table.more}</span>
                                   </th>
                              </tr>
                         </thead>
                         <tbody>
                              {data.rows.length === 0 && (
                                   <tr>
                                        <td
                                             colSpan={7}
                                             className="px-4 py-10 text-center text-ink-3"
                                        >
                                             {m.table.empty}
                                        </td>
                                   </tr>
                              )}
                              {data.rows.map((row) => {
                                   const selected = query.org === row.id
                                   return (
                                        <tr
                                             key={row.id}
                                             aria-selected={selected}
                                             className={cn(
                                                  'border-b border-line last:border-0',
                                                  selected ? 'bg-brand-50/60' : 'hover:bg-paper/60',
                                             )}
                                        >
                                             <td className="px-4 py-2.5">
                                                  <Link
                                                       href={href({ org: row.id })}
                                                       scroll={false}
                                                       className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-brand-300"
                                                  >
                                                       <OrgAvatar
                                                            name={row.name}
                                                            color={row.color}
                                                       />
                                                       <span className="min-w-0">
                                                            <span className="block truncate font-semibold text-ink">
                                                                 {row.name}
                                                            </span>
                                                            <span className="block truncate text-xs text-ink-3">
                                                                 {row.ownerEmail}
                                                            </span>
                                                       </span>
                                                  </Link>
                                             </td>
                                             <td className="px-3 py-2.5">
                                                  <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-ink-2">
                                                       {m.table.trialPlan}
                                                  </span>
                                             </td>
                                             <td className="tabular px-3 py-2.5 text-right font-medium">
                                                  {n(row.outlets)}
                                             </td>
                                             <td className="px-3 py-2.5">
                                                  {row.status && (
                                                       <OrgStatusPill
                                                            status={row.status}
                                                            label={m.status[row.status]}
                                                       />
                                                  )}
                                             </td>
                                             <td className="tabular px-3 py-2.5 text-right text-ink-3">
                                                  —
                                             </td>
                                             <td className="px-3 py-2.5 whitespace-nowrap text-ink-2">
                                                  {isToday(row.createdAt)
                                                       ? m.table.today
                                                       : formatMonth(row.createdAt, locale)}
                                             </td>
                                             <td className="px-2 py-2.5">
                                                  <a
                                                       href={`${CONSOLE_ROUTES.dataAdmin}/collections/organizations/${row.id}`}
                                                       title={m.table.more}
                                                       aria-label={`${m.table.more}: ${row.name}`}
                                                       className="flex size-8 items-center justify-center rounded-lg text-ink-3 hover:bg-paper hover:text-ink"
                                                  >
                                                       <EllipsisVertical
                                                            aria-hidden
                                                            className="size-4"
                                                       />
                                                  </a>
                                             </td>
                                        </tr>
                                   )
                              })}
                         </tbody>
                    </table>
               </div>

               <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-ink-3">
                    <span>
                         {interpolate(m.table.showing, {
                              from: n(from),
                              to: n(to),
                              total: n(data.total),
                         })}
                    </span>
                    {data.totalPages > 1 && (
                         <nav className="flex items-center gap-1">
                              <PageLink
                                   href={href({ page: data.page - 1, org: null })}
                                   disabled={data.page <= 1}
                                   label={m.table.previous}
                              >
                                   <ChevronLeft aria-hidden className="size-4" />
                              </PageLink>
                              {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                                   .filter(
                                        (p) =>
                                             p === 1 ||
                                             p === data.totalPages ||
                                             Math.abs(p - data.page) <= 1,
                                   )
                                   .map((p) => (
                                        <PageLink
                                             key={p}
                                             href={href({ page: p, org: null })}
                                             active={p === data.page}
                                             label={String(p)}
                                        >
                                             {n(p)}
                                        </PageLink>
                                   ))}
                              <PageLink
                                   href={href({ page: data.page + 1, org: null })}
                                   disabled={data.page >= data.totalPages}
                                   label={m.table.next}
                              >
                                   <ChevronRight aria-hidden className="size-4" />
                              </PageLink>
                         </nav>
                    )}
               </footer>
          </section>
     )
}

function PageLink({
     href,
     label,
     active,
     disabled,
     children,
}: {
     href: string
     label: string
     active?: boolean
     disabled?: boolean
     children: React.ReactNode
}) {
     const box =
          'tabular flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-semibold'
     if (disabled) {
          return (
               <span aria-disabled="true" className={cn(box, 'border-line text-ink-3/50')}>
                    {children}
               </span>
          )
     }
     return (
          <Link
               href={href}
               aria-label={label}
               aria-current={active ? 'page' : undefined}
               className={cn(
                    box,
                    active
                         ? 'border-brand-700 bg-brand-700 text-white'
                         : 'border-line text-ink-2 hover:bg-paper',
               )}
          >
               {children}
          </Link>
     )
}
