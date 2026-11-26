'use client'

import { usePathname } from 'next/navigation'

import { useTranslations } from '@/i18n/client'
import { ShellTopbar } from '@/shared/components/shell'

import { consoleItemFor } from './nav'

/** Console top bar (guide p.27): "Platform · All tenants" + the page title from the menu. */
export function ConsoleTopbar() {
     const { m } = useTranslations('console')
     const common = useTranslations('common').m
     const item = consoleItemFor(usePathname())

     return (
          <ShellTopbar
               eyebrow={m.topbar.eyebrow}
               title={m.nav.items[item.id]}
               searchPlaceholder={m.topbar.search}
               notificationsLabel={m.topbar.notifications}
               soonLabel={common.states.soon}
          />
     )
}
