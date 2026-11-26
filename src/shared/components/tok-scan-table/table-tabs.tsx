import Link from 'next/link'

import { cn } from '@/shared/lib/utils'

export type TableTab = {
     id: string
     label: string
     /** Count pill, already formatted (e.g. Khmer digits) */
     count?: string
     /** Link to this tab; without it the tab shows `soonLabel` and can't be clicked */
     href?: string
}

/** Status tabs above a table, each with a count (guide p.27 / p.10). */
export function TableTabs({
     label,
     tabs,
     active,
     soonLabel,
}: {
     /** Accessible name, e.g. "Status" */
     label: string
     tabs: TableTab[]
     /** id of the current tab */
     active: string
     soonLabel?: string
}) {
     return (
          <nav aria-label={label} className="flex gap-1 overflow-x-auto border-b border-line px-3">
               {tabs.map((tab) => {
                    if (!tab.href) {
                         return (
                              <span
                                   key={tab.id}
                                   title={soonLabel}
                                   aria-disabled="true"
                                   className="flex shrink-0 cursor-not-allowed items-center gap-1.5 px-2.5 py-3 text-sm whitespace-nowrap text-ink-3"
                              >
                                   {tab.label}
                                   {soonLabel && (
                                        <span className="rounded-full bg-paper px-1.5 text-[0.625rem] font-semibold">
                                             {soonLabel}
                                        </span>
                                   )}
                              </span>
                         )
                    }
                    const current = tab.id === active
                    return (
                         <Link
                              key={tab.id}
                              href={tab.href}
                              aria-current={current ? 'page' : undefined}
                              className={cn(
                                   '-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-3 text-sm whitespace-nowrap',
                                   current
                                        ? 'border-brand-700 font-semibold text-ink'
                                        : 'border-transparent text-ink-2 hover:text-ink',
                              )}
                         >
                              {tab.label}
                              {tab.count !== undefined && (
                                   <span
                                        className={cn(
                                             'tabular rounded-full px-1.5 text-xs font-semibold',
                                             current
                                                  ? 'bg-brand-700 text-white'
                                                  : 'bg-paper text-ink-3',
                                        )}
                                   >
                                        {tab.count}
                                   </span>
                              )}
                         </Link>
                    )
               })}
          </nav>
     )
}
