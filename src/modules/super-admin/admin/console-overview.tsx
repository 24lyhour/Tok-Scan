import type { I18nClient } from '@payloadcms/translations'
import type { Payload, Where } from 'payload'

import { isSuperAdmin } from '@/modules/core/payload'
import { ORG_STATUSES, type OrgStatus } from '@/modules/tenancy'
import type { Organization, User } from '@/payload-types'
import { ConsoleView, StatusBadge, type ConsoleRow } from '@/shared/components/super-admin'

import { tr, type PlatformAdminKey } from './translations'

const STAT_KEYS: { key: PlatformAdminKey; status?: OrgStatus }[] = [
     { key: 'statOrganizations' },
     { key: 'statActive', status: 'active' },
     { key: 'statTrial', status: 'trial' },
     { key: 'statPending', status: 'pending_approval' },
     { key: 'statSuspended', status: 'suspended' },
]

/**
 * Super-admin console home (guide p.27, first version) — Payload `beforeDashboard`.
 * Loads the numbers and lists; the shared ConsoleView draws them.
 */
export async function ConsoleOverview({
     payload,
     i18n,
     user,
}: {
     payload: Payload
     i18n: I18nClient
     user?: User | null
}) {
     if (!isSuperAdmin(user)) return null
     const t = (key: PlatformAdminKey) => tr(i18n.t, key)
     const admin = payload.config.routes.admin
     const orgsUrl = `${admin}/collections/organizations`
     const byStatus = (status: OrgStatus) => `${orgsUrl}?where[status][equals]=${status}`
     const count = async (collection: 'organizations' | 'outlets' | 'tables', where?: Where) =>
          (await payload.count({ collection, where, overrideAccess: true })).totalDocs

     const [orgCounts, outlets, tables, pending, recent] = await Promise.all([
          Promise.all(
               STAT_KEYS.map((s) =>
                    count('organizations', s.status ? { status: { equals: s.status } } : undefined),
               ),
          ),
          count('outlets'),
          count('tables'),
          payload.find({
               collection: 'organizations',
               where: { status: { equals: 'pending_approval' } },
               sort: 'createdAt',
               limit: 5,
               depth: 1,
               overrideAccess: true,
          }),
          payload.find({
               collection: 'organizations',
               sort: '-createdAt',
               limit: 6,
               depth: 1,
               overrideAccess: true,
          }),
     ])

     const date = (value: string) =>
          new Intl.DateTimeFormat(i18n.language === 'zh' ? 'zh-CN' : 'en-GB', {
               dateStyle: 'medium',
          }).format(new Date(value))
     const ownerEmail = (o: Organization) =>
          typeof o.owner === 'object' && o.owner ? o.owner.email : '—'
     const badge = (status: Organization['status']) =>
          status && (ORG_STATUSES as readonly string[]).includes(status) ? (
               <StatusBadge status={status} label={t(`status_${status}`)} />
          ) : null
     const row = (o: Organization, cells: ConsoleRow['cells']): ConsoleRow => ({
          id: o.id,
          name: o.name,
          href: `${orgsUrl}/${o.id}`,
          sub: `/r/${o.slug}`,
          cells,
     })

     return (
          <ConsoleView
               title={t('console')}
               subtitle={t('subtitle')}
               stats={[
                    ...STAT_KEYS.map((s, i) => ({
                         label: t(s.key),
                         value: orgCounts[i] ?? 0,
                         href: s.status ? byStatus(s.status) : orgsUrl,
                         warn: s.status === 'pending_approval' && Boolean(orgCounts[i]),
                    })),
                    {
                         label: t('statOutlets'),
                         value: outlets,
                         href: `${admin}/collections/outlets`,
                    },
                    { label: t('statTables'), value: tables, href: `${admin}/collections/tables` },
               ]}
               panels={[
                    {
                         title: t('pendingTitle'),
                         empty: t('pendingEmpty'),
                         action: { href: byStatus('pending_approval'), label: t('review') },
                         columns: [t('colOrganization'), t('colOwner'), t('colSignedUp')],
                         rows: pending.docs.map((o) => row(o, [ownerEmail(o), date(o.createdAt)])),
                    },
                    {
                         title: t('recentTitle'),
                         empty: t('recentEmpty'),
                         action: { href: orgsUrl, label: t('viewAll') },
                         columns: [t('colOrganization'), t('colStatus'), t('colSignedUp')],
                         rows: recent.docs.map((o) => row(o, [badge(o.status), date(o.createdAt)])),
                    },
               ]}
          />
     )
}
