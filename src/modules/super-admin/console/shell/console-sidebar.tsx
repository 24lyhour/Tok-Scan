'use client'

import type { ReactNode } from 'react'

import { useTranslations } from '@/i18n/client'
import { ShellSidebar } from '@/shared/components/shell'

import { CONSOLE_NAV } from './nav'

/** Console sidebar (guide p.27): the shared ShellSidebar in charcoal with the console menu. */
export function ConsoleSidebar({
     header,
     footer,
     pendingCount,
}: {
     header: ReactNode
     footer: ReactNode
     pendingCount: number
}) {
     const { m } = useTranslations('console')
     const common = useTranslations('common').m

     return (
          <ShellSidebar
               tone="charcoal"
               header={header}
               footer={footer}
               labels={{
                    main: m.nav.main,
                    open: m.nav.open,
                    close: common.actions.close,
                    soon: common.states.soon,
                    locked: common.states.soon,
               }}
               groups={CONSOLE_NAV.map(({ group, items }) => ({
                    id: group,
                    label: m.nav.groups[group],
                    items: items.map((item) => ({
                         id: item.id,
                         icon: item.icon,
                         href: item.href,
                         label: m.nav.items[item.id],
                         badge: item.countsPending ? pendingCount : undefined,
                    })),
               }))}
          />
     )
}
