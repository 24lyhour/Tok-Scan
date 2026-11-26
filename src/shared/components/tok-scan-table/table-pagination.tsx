import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { interpolate, localizeDigits } from '@/shared/i18n/format'
import type { Locale } from '@/shared/i18n/locales'
import { cn } from '@/shared/lib/utils'

/** Page numbers to show: first, last, and the pages around the current one. */
export function visiblePages(page: number, totalPages: number): number[] {
     return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
          (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
     )
}

/**
 * Footer under a table (guide p.27): "Showing 1–10 of 141" and page buttons.
 * Pages are links (`hrefFor`), so they work with server-rendered lists.
 */
export function TablePagination({
     page,
     totalPages,
     total,
     pageSize,
     hrefFor,
     labels,
     locale,
}: {
     page: number
     totalPages: number
     total: number
     pageSize: number
     hrefFor: (page: number) => string
     /** showing: "Showing {from}–{to} of {total}" */
     labels: { showing: string; previous: string; next: string }
     locale: Locale
}) {
     const n = (value: number) => localizeDigits(value, locale)
     const from = total ? (page - 1) * pageSize + 1 : 0
     const to = Math.min(page * pageSize, total)

     return (
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-ink-3">
               <span>
                    {interpolate(labels.showing, { from: n(from), to: n(to), total: n(total) })}
               </span>
               {totalPages > 1 && (
                    <nav className="flex items-center gap-1">
                         <PageLink
                              href={hrefFor(page - 1)}
                              disabled={page <= 1}
                              label={labels.previous}
                         >
                              <ChevronLeft aria-hidden className="size-4" />
                         </PageLink>
                         {visiblePages(page, totalPages).map((p) => (
                              <PageLink
                                   key={p}
                                   href={hrefFor(p)}
                                   active={p === page}
                                   label={String(p)}
                              >
                                   {n(p)}
                              </PageLink>
                         ))}
                         <PageLink
                              href={hrefFor(page + 1)}
                              disabled={page >= totalPages}
                              label={labels.next}
                         >
                              <ChevronRight aria-hidden className="size-4" />
                         </PageLink>
                    </nav>
               )}
          </footer>
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
     children: ReactNode
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
