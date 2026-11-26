/** English — the source of truth: every other language must have exactly the same keys. */
import type { PluralForms } from '@/shared/i18n/format'

import type { NavGroupId, NavItemId } from '../shell/nav'

export const en = {
     nav: {
          main: 'Main navigation',
          open: 'Open menu',
          locked: 'Add your menu first',
          groups: {
               overview: 'Overview',
               catalogue: 'Catalogue',
               operations: 'Operations',
               people: 'People & insights',
          } satisfies Record<NavGroupId, string>,
          items: {
               dashboard: 'Dashboard',
               menu: 'Menu Management',
               categories: 'Categories',
               products: 'Products',
               orders: 'Orders',
               billing: 'Billing',
               payments: 'Payments',
               tables: 'Tables',
               qr: 'QR Codes',
               customers: 'Customers',
               staff: 'Staff',
               reports: 'Sales Reports',
               settings: 'Settings',
          } satisfies Record<NavItemId, string>,
     },
     switcher: {
          label: 'Switch organization or outlet',
          current: '{outlet} · {index} of {total} outlets',
          organizations: 'Organizations',
          membership: '{role} · {outlets}',
          outletCount: { one: '{count} outlet', other: '{count} outlets' } as PluralForms,
          outletsOf: 'Outlets · {org}',
          tables: '{count} tables',
          allOutlets: 'All outlets',
          reportsOnly: 'reports only',
          createOutlet: 'Create outlet',
          used: '{used} / {max} used',
          roles: { owner: 'Owner', admin: 'Admin', member: 'Member' },
     },
     plan: {
          trial: 'Free trial · {plan}',
          outlets: '{used}/{max} outlets',
          ends: 'Ends {date}',
          choose: 'Choose plan',
     },
     topbar: {
          today: 'Today, {date}',
          search: 'Search orders, tables, invoices…',
          notifications: 'Notifications',
     },
     user: {
          role: '{role} · {org}',
     },
     dashboard: {
          kpi: {
               revenue: 'Total revenue',
               orders: 'Total orders',
               pending: 'Pending orders',
               completed: 'Completed',
               customers: 'Customers',
               avgTicket: 'Avg. ticket',
          },
          noOrders: 'No orders yet — your numbers appear here once guests start ordering.',
          liveTables: 'Live tables',
          inUse: '{used} of {total} in use',
          legend: {
               available: 'Available',
               occupied: 'Occupied',
               ordering: 'Ordering',
               awaiting: 'Awaiting payment',
          },
          editTables: 'Edit tables',
     },
}

export type WorkspaceContent = typeof en
