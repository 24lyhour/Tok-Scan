import { Check } from 'lucide-react'
import Link from 'next/link'

import { interpolate, localizeDigits } from '@/shared/i18n/format'
import type { Locale } from '@/shared/i18n/locales'
import { cn } from '@/shared/lib/utils'

import type { OnboardingContent } from '../content'
import type { GoLiveRow } from './checklist'

/**
 * Go-live checklist (guide p.22–23). `compact` = the short version inside step 4;
 * the full version on the dashboard adds edit links and "coming soon" actions.
 */
export function ChecklistCard({
     rows,
     title,
     m,
     locale,
     compact = false,
}: {
     rows: GoLiveRow[]
     title: string
     m: OnboardingContent['dashboard']
     locale: Locale
     compact?: boolean
}) {
     const done = rows.filter((r) => r.done).length
     const progress = interpolate(m.progress, {
          done: localizeDigits(done, locale),
          total: localizeDigits(rows.length, locale),
     })

     return (
          <section aria-label={title} className="rounded-2xl border border-line bg-white">
               <header className="flex items-center justify-between gap-3 px-4 pt-4">
                    <h2 className={cn('font-semibold text-ink', compact ? 'text-sm' : 'text-base')}>
                         {title}
                    </h2>
                    <span className="tabular text-xs font-semibold text-brand-700">{progress}</span>
               </header>
               <div className="mx-4 mt-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
                    <span
                         className="block h-full rounded-full bg-brand-700 transition-[width] duration-[400ms]"
                         style={{ width: `${(done / rows.length) * 100}%` }}
                    />
               </div>
               <ul className="mt-2 divide-y divide-line">
                    {rows.map((row) => (
                         <li
                              key={row.id}
                              className={cn(
                                   'flex items-center gap-3 px-4',
                                   compact ? 'py-2.5' : 'py-3',
                              )}
                         >
                              <span
                                   className={cn(
                                        'flex size-6 shrink-0 items-center justify-center rounded-full border',
                                        row.done
                                             ? 'border-success bg-success text-white'
                                             : 'border-line bg-white',
                                   )}
                              >
                                   {row.done && (
                                        <Check aria-hidden className="size-3.5" strokeWidth={3} />
                                   )}
                              </span>
                              <span
                                   className={cn(
                                        'min-w-0 flex-1 text-sm',
                                        row.done ? 'text-ink-3' : 'font-medium text-ink',
                                   )}
                              >
                                   {m.items[row.id]}
                              </span>
                              {!compact && row.done && row.href && (
                                   <Link
                                        href={row.href}
                                        className="text-xs font-semibold text-brand-700 hover:underline"
                                   >
                                        {m.editSetup}
                                   </Link>
                              )}
                              {!compact && !row.done && row.action && (
                                   <span
                                        title={m.actions.soon}
                                        className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-ink-3"
                                   >
                                        {m.actions[row.action]}
                                   </span>
                              )}
                         </li>
                    ))}
               </ul>
          </section>
     )
}
