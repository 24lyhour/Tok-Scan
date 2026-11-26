'use client'

import { Bell, Search, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { useTranslations } from '@/i18n/client'

import { navItemFor } from './nav'

/**
 * Top bar of every app page (guide p.8 / p.24): "Group · Today, date", the page title, search,
 * plan badge and notifications. The title comes from the sidebar menu (nav.ts), so pages never
 * repeat it.
 */
export function Topbar({ today, planBadge }: { today: string; planBadge: string }) {
     const { m } = useTranslations('workspace')
     const common = useTranslations('common').m
     const { group, item } = navItemFor(usePathname())

     return (
          <header className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-3 sm:px-6">
               <div className="min-w-0 flex-1">
                    <p className="text-xs text-ink-3">
                         {m.nav.groups[group]} · {today}
                    </p>
                    <h1 className="truncate text-lg font-bold tracking-tight text-ink">
                         {m.nav.items[item.id]}
                    </h1>
               </div>
               <label className="relative hidden w-72 md:block">
                    <span className="sr-only">{m.topbar.search}</span>
                    <Search
                         aria-hidden
                         className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3"
                    />
                    <input
                         type="search"
                         disabled
                         title={common.states.soon}
                         placeholder={m.topbar.search}
                         className="h-10 w-full cursor-not-allowed rounded-xl border border-line bg-paper pr-3 pl-9 text-sm placeholder:text-ink-3"
                    />
               </label>
               <span className="hidden items-center gap-1 rounded-full bg-saffron-50 px-3 py-1.5 text-xs font-semibold text-ink sm:inline-flex">
                    <Sparkles aria-hidden className="size-3.5 text-saffron-600" />
                    {planBadge}
               </span>
               <button
                    type="button"
                    disabled
                    aria-label={m.topbar.notifications}
                    title={common.states.soon}
                    className="flex size-10 items-center justify-center rounded-xl border border-line bg-white text-ink-2 disabled:cursor-not-allowed"
               >
                    <Bell aria-hidden className="size-[18px]" />
               </button>
          </header>
     )
}
