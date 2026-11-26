'use client'

import { Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { useTranslations } from '@/i18n/client'
import { ShellTopbar } from '@/shared/components/shell'

import { navItemFor } from './nav'

/**
 * Restaurant app top bar (guide p.8 / p.24): "Group · Today, date", the page title, plan badge.
 * The title comes from the sidebar menu (nav.ts), so pages never repeat it.
 */
export function Topbar({ today, planBadge }: { today: string; planBadge: string }) {
     const { m } = useTranslations('workspace')
     const common = useTranslations('common').m
     const { group, item } = navItemFor(usePathname())

     return (
          <ShellTopbar
               eyebrow={`${m.nav.groups[group]} · ${today}`}
               title={m.nav.items[item.id]}
               searchPlaceholder={m.topbar.search}
               notificationsLabel={m.topbar.notifications}
               soonLabel={common.states.soon}
          >
               <span className="hidden items-center gap-1 rounded-full bg-saffron-50 px-3 py-1.5 text-xs font-semibold text-ink sm:inline-flex">
                    <Sparkles aria-hidden className="size-3.5 text-saffron-600" />
                    {planBadge}
               </span>
          </ShellTopbar>
     )
}
