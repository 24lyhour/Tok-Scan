'use client'

import type { ReactNode } from 'react'

import { useTranslations } from '@/i18n/client'
import { ShellSidebar } from '@/shared/components/shell'

import { NAV } from './nav'

/**
 * Restaurant app sidebar (guide p.8 / p.24): the shared green ShellSidebar with this app's menu
 * (nav.ts), the organization/outlet switcher and the plan + user cards.
 */
export function Sidebar({
     switcher,
     footer,
     qrUnlocked,
}: {
     /** Organization / outlet switcher */
     switcher: ReactNode
     /** Plan card + user card (bottom) */
     footer: ReactNode
     /** QR codes open only once the menu exists */
     qrUnlocked: boolean
}) {
     const { m } = useTranslations('workspace')
     const common = useTranslations('common').m

     return (
          <ShellSidebar
               tone="green"
               header={switcher}
               footer={footer}
               labels={{
                    main: m.nav.main,
                    open: m.nav.open,
                    close: common.actions.close,
                    soon: common.states.soon,
                    locked: m.nav.locked,
               }}
               groups={NAV.map(({ group, items }) => ({
                    id: group,
                    label: m.nav.groups[group],
                    items: items.map((item) => ({
                         ...item,
                         label: m.nav.items[item.id],
                         locked: Boolean(item.lockable && !qrUnlocked),
                    })),
               }))}
          />
     )
}
