/**
 * Sidebar menu (design guide p.8 / p.24) — groups and items, in order. An item with an `href` is
 * built; without one it shows "Soon" until its module exists.
 */
import {
     BookOpen,
     ChartColumn,
     ClipboardList,
     LayoutDashboard,
     Package,
     QrCode,
     ReceiptText,
     Settings,
     Tag,
     UserRound,
     Users,
     UtensilsCrossed,
     Wallet,
     type LucideIcon,
} from 'lucide-react'

import { APP_ROUTES } from '@/shared/config/app-routes'

export const NAV_GROUPS = ['overview', 'catalogue', 'operations', 'people'] as const
export type NavGroupId = (typeof NAV_GROUPS)[number]

export const NAV_ITEMS = [
     'dashboard',
     'menu',
     'categories',
     'products',
     'orders',
     'billing',
     'payments',
     'tables',
     'qr',
     'customers',
     'staff',
     'reports',
     'settings',
] as const
export type NavItemId = (typeof NAV_ITEMS)[number]

export type NavItem = {
     id: NavItemId
     icon: LucideIcon
     /** Built pages only */
     href?: string
     /** Unlocks later (QR codes: after the menu exists) */
     lockable?: boolean
}

export const NAV: { group: NavGroupId; items: NavItem[] }[] = [
     {
          group: 'overview',
          items: [{ id: 'dashboard', icon: LayoutDashboard, href: APP_ROUTES.dashboard }],
     },
     {
          group: 'catalogue',
          items: [
               { id: 'menu', icon: BookOpen },
               { id: 'categories', icon: Tag },
               { id: 'products', icon: Package },
          ],
     },
     {
          group: 'operations',
          items: [
               { id: 'orders', icon: ClipboardList },
               { id: 'billing', icon: ReceiptText },
               { id: 'payments', icon: Wallet },
               { id: 'tables', icon: UtensilsCrossed, href: APP_ROUTES.tables },
               { id: 'qr', icon: QrCode, href: '/onboarding/tables/print', lockable: true },
          ],
     },
     {
          group: 'people',
          items: [
               { id: 'customers', icon: Users },
               { id: 'staff', icon: UserRound },
               { id: 'reports', icon: ChartColumn },
               { id: 'settings', icon: Settings },
          ],
     },
]

/** The menu item (and its group) for a URL — gives every app page its title. */
export function navItemFor(pathname: string): { group: NavGroupId; item: NavItem } {
     for (const { group, items } of NAV) {
          const item = items.find(
               (i) => i.href && (pathname === i.href || pathname.startsWith(`${i.href}/`)),
          )
          if (item) return { group, item }
     }
     return { group: 'overview', item: NAV[0]!.items[0]! }
}
