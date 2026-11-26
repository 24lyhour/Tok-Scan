/**
 * Console sidebar (guide p.27) — groups and items, in order. An item with an `href` is built;
 * without one it shows "Soon" until that part of the console exists.
 */
import {
     Bell,
     Building2,
     Check,
     CreditCard,
     FileText,
     LayoutGrid,
     Network,
     Settings,
     ShieldCheck,
     Users,
     type LucideIcon,
} from 'lucide-react'

import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

export const CONSOLE_GROUPS = ['platform', 'revenue', 'operations'] as const
export type ConsoleGroupId = (typeof CONSOLE_GROUPS)[number]

export const CONSOLE_ITEMS = [
     'overview',
     'organizations',
     'approvals',
     'plans',
     'subscriptions',
     'gateways',
     'support',
     'audit',
     'team',
     'settings',
] as const
export type ConsoleItemId = (typeof CONSOLE_ITEMS)[number]

export type ConsoleNavItem = {
     id: ConsoleItemId
     icon: LucideIcon
     href?: string
     /** Shows the number of restaurants waiting for approval */
     countsPending?: boolean
}

export const CONSOLE_NAV: { group: ConsoleGroupId; items: ConsoleNavItem[] }[] = [
     {
          group: 'platform',
          items: [
               { id: 'overview', icon: LayoutGrid },
               { id: 'organizations', icon: Building2, href: CONSOLE_ROUTES.organizations },
               {
                    id: 'approvals',
                    icon: Check,
                    href: CONSOLE_ROUTES.approvals,
                    countsPending: true,
               },
          ],
     },
     {
          group: 'revenue',
          items: [
               { id: 'plans', icon: CreditCard },
               { id: 'subscriptions', icon: FileText },
               { id: 'gateways', icon: Network },
          ],
     },
     {
          group: 'operations',
          items: [
               { id: 'support', icon: Bell },
               { id: 'audit', icon: ShieldCheck },
               { id: 'team', icon: Users },
               { id: 'settings', icon: Settings },
          ],
     },
]

/** The menu item for a URL — gives every console page its title. */
export function consoleItemFor(pathname: string): ConsoleNavItem {
     for (const { items } of CONSOLE_NAV) {
          const item = items.find(
               (i) => i.href && (pathname === i.href || pathname.startsWith(`${i.href}/`)),
          )
          if (item) return item
     }
     return CONSOLE_NAV[0]!.items[1]!
}
