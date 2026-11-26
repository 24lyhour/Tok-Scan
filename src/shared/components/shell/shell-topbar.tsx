import { Bell, Search } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Top bar of an app page (guide p.8 / p.27): small eyebrow line, page title, search, extra
 * badges, notifications. Search and notifications are placeholders until those features exist.
 */
export function ShellTopbar({
     eyebrow,
     title,
     searchPlaceholder,
     notificationsLabel,
     soonLabel,
     children,
}: {
     /** e.g. "Overview · Today, 25 Nov 2026" or "Platform · All tenants" */
     eyebrow: string
     title: string
     searchPlaceholder: string
     notificationsLabel: string
     soonLabel: string
     /** Extra items before the bell (plan badge …) */
     children?: ReactNode
}) {
     return (
          <header className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-3 sm:px-6">
               <div className="min-w-0 flex-1">
                    <p className="text-xs text-ink-3">{eyebrow}</p>
                    <h1 className="truncate text-lg font-bold tracking-tight text-ink">{title}</h1>
               </div>
               <label className="relative hidden w-72 md:block">
                    <span className="sr-only">{searchPlaceholder}</span>
                    <Search
                         aria-hidden
                         className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3"
                    />
                    <input
                         type="search"
                         disabled
                         title={soonLabel}
                         placeholder={searchPlaceholder}
                         className="h-10 w-full cursor-not-allowed rounded-xl border border-line bg-paper pr-12 pl-9 text-sm placeholder:text-ink-3"
                    />
                    <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md border border-line bg-white px-1.5 py-0.5 text-[0.625rem] font-semibold text-ink-3">
                         ⌘K
                    </kbd>
               </label>
               {children}
               <button
                    type="button"
                    disabled
                    aria-label={notificationsLabel}
                    title={soonLabel}
                    className="flex size-10 items-center justify-center rounded-xl border border-line bg-white text-ink-2 disabled:cursor-not-allowed"
               >
                    <Bell aria-hidden className="size-[18px]" />
               </button>
          </header>
     )
}
