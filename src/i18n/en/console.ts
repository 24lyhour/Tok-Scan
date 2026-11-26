/** English — the source of truth: every other language must have exactly the same keys. */
import type { OrgStatus } from '@/modules/tenancy'
import type { PluralForms } from '@/shared/i18n/format'

import type { ConsoleGroupId, ConsoleItemId } from '@/modules/super-admin'
import type { OrgTab } from '@/modules/super-admin'

export const console = {
     meta: { title: 'Platform console' },
     nav: {
          main: 'Console navigation',
          open: 'Open menu',
          badge: 'Platform console · staff only',
          groups: {
               platform: 'Platform',
               revenue: 'Revenue',
               operations: 'Operations',
          } satisfies Record<ConsoleGroupId, string>,
          items: {
               overview: 'Overview',
               organizations: 'Organizations',
               approvals: 'Approvals',
               plans: 'Plans & billing',
               subscriptions: 'Subscriptions',
               gateways: 'Gateway partners',
               support: 'Support tickets',
               audit: 'Audit log',
               team: 'Platform team',
               settings: 'Platform settings',
          } satisfies Record<ConsoleItemId, string>,
          dataAdmin: 'Data admin',
     },
     topbar: {
          eyebrow: 'Platform · All tenants',
          search: 'Search orders, tables, invoices…',
          notifications: 'Notifications',
     },
     user: { role: 'Super-admin · tok-scan' },
     kpi: {
          active: 'Active organizations',
          outlets: 'Outlets live',
          mrr: 'MRR',
          gmv: 'GMV processed (30d)',
          pending: 'Pending approvals',
          thisMonth: '{count} this month',
          oldest: 'oldest {days}',
          days: { one: '{count} day', other: '{count} days' } as PluralForms,
          noneWaiting: 'none waiting',
          soon: 'with billing',
     },
     tabs: {
          all: 'All',
          active: 'Active',
          trial: 'Trial',
          pending_approval: 'Pending',
          overdue: 'Overdue',
          suspended: 'Suspended',
     } satisfies Record<OrgTab | 'overdue', string>,
     filters: {
          search: 'Organization, owner email, slug',
          plan: 'Plan: All',
          csv: 'CSV',
     },
     table: {
          trialPlan: 'Free trial',
          organization: 'Organization',
          plan: 'Plan',
          outlets: 'Outlets',
          status: 'Status',
          gmv: 'GMV 30D',
          since: 'Since',
          today: 'Today',
          more: 'Open in data admin',
          empty: 'No organizations match.',
          showing: 'Showing {from}–{to} of {total}',
          previous: 'Previous page',
          next: 'Next page',
     },
     status: {
          trial: 'Trial',
          pending_approval: 'Pending approval',
          active: 'Active',
          suspended: 'Suspended',
          closed: 'Closed',
     } satisfies Record<OrgStatus, string>,
     detail: {
          select: 'Select an organization to see its details.',
          verification: 'Verification',
          checks: {
               licence: 'Business licence / patent',
               ownerId: 'Owner ID verified',
               contact: 'Phone & email confirmed',
               khqr: 'KHQR merchant ID',
          },
          notCollected: 'Soon',
          owner: 'Owner',
          outletsTables: 'Outlets / tables',
          signedUp: 'Signed up',
          trialEnds: 'Trial ends',
          lastChange: 'Last status change',
          lastChangeBy: '{date} by {name}',
          viewAsNote:
               '"View as tenant" opens read-only, expires in 30 min, and is written to the audit log.',
          requestInfo: 'Request info',
          approve: 'Approve',
          viewAsTenant: 'View as tenant',
          suspend: 'Suspend…',
          confirmSuspend: 'Yes, suspend',
          suspendQuestion: 'Suspend {name}? Guests can no longer order or pay.',
          reactivate: 'Reactivate',
          cancel: 'Cancel',
          close: 'Close details',
     },
     errors: {
          generic: 'Something went wrong. Please try again.',
          forbidden: 'Only tok-scan staff can do this.',
          notAllowed: 'This change is not allowed from the current status.',
     },
}

export type ConsoleContent = typeof console
