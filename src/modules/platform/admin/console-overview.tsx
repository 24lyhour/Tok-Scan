import type { I18nClient } from '@payloadcms/translations'
import type { Payload, Where } from 'payload'

import { isSuperAdmin } from '@/modules/core/payload'
import { ORG_STATUSES, type OrgStatus } from '@/modules/tenancy'
import type { Organization, User } from '@/payload-types'

import styles from './console.module.css'
import { tr, type PlatformAdminKey } from './translations'

const STAT_KEYS: { key: PlatformAdminKey; status?: OrgStatus }[] = [
     { key: 'statOrganizations' },
     { key: 'statActive', status: 'active' },
     { key: 'statTrial', status: 'trial' },
     { key: 'statPending', status: 'pending_approval' },
     { key: 'statSuspended', status: 'suspended' },
]

/**
 * Super-admin console home (guide p.27, first version) — shown above Payload's dashboard:
 * restaurant counts by status, outlets and tables, what's waiting for approval, newest sign-ups.
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
     const badge = (status: OrgStatus | null | undefined) =>
          status && (ORG_STATUSES as readonly string[]).includes(status) ? (
               <span className={`${styles.badge} ${styles[`badge_${status}`]}`}>
                    {t(`status_${status}`)}
               </span>
          ) : null

     return (
          <section className={styles.console}>
               <h2 className={styles.title}>{t('console')}</h2>
               <p className={styles.subtitle}>{t('subtitle')}</p>

               <div className={styles.stats}>
                    {STAT_KEYS.map((s, i) => (
                         <a
                              key={s.key}
                              href={s.status ? byStatus(s.status) : orgsUrl}
                              className={`${styles.stat} ${s.status === 'pending_approval' && orgCounts[i] ? styles.statWarn : ''}`}
                         >
                              <div className={styles.statLabel}>{t(s.key)}</div>
                              <div className={styles.statValue}>{orgCounts[i]}</div>
                         </a>
                    ))}
                    <a href={`${admin}/collections/outlets`} className={styles.stat}>
                         <div className={styles.statLabel}>{t('statOutlets')}</div>
                         <div className={styles.statValue}>{outlets}</div>
                    </a>
                    <a href={`${admin}/collections/tables`} className={styles.stat}>
                         <div className={styles.statLabel}>{t('statTables')}</div>
                         <div className={styles.statValue}>{tables}</div>
                    </a>
               </div>

               <div className={styles.panels}>
                    <OrgPanel
                         title={t('pendingTitle')}
                         empty={t('pendingEmpty')}
                         action={{ href: byStatus('pending_approval'), label: t('review') }}
                         rows={pending.docs}
                         columns={[t('colOrganization'), t('colOwner'), t('colSignedUp')]}
                         cells={(o) => [ownerEmail(o), date(o.createdAt)]}
                         orgsUrl={orgsUrl}
                    />
                    <OrgPanel
                         title={t('recentTitle')}
                         empty={t('recentEmpty')}
                         action={{ href: orgsUrl, label: t('viewAll') }}
                         rows={recent.docs}
                         columns={[t('colOrganization'), t('colStatus'), t('colSignedUp')]}
                         cells={(o) => [badge(o.status as OrgStatus), date(o.createdAt)]}
                         orgsUrl={orgsUrl}
                    />
               </div>
          </section>
     )
}

function OrgPanel({
     title,
     empty,
     action,
     rows,
     columns,
     cells,
     orgsUrl,
}: {
     title: string
     empty: string
     action: { href: string; label: string }
     rows: Organization[]
     columns: string[]
     cells: (o: Organization) => React.ReactNode[]
     orgsUrl: string
}) {
     return (
          <div className={styles.panel}>
               <div className={styles.panelHead}>
                    <span>{title}</span>
                    <a href={action.href}>{action.label} →</a>
               </div>
               {rows.length === 0 ? (
                    <p className={styles.empty}>{empty}</p>
               ) : (
                    <table className={styles.table}>
                         <thead>
                              <tr>
                                   {columns.map((c) => (
                                        <th key={c}>{c}</th>
                                   ))}
                              </tr>
                         </thead>
                         <tbody>
                              {rows.map((o) => (
                                   <tr key={o.id}>
                                        <td>
                                             <a href={`${orgsUrl}/${o.id}`}>{o.name}</a>
                                             <div className={styles.muted}>/r/{o.slug}</div>
                                        </td>
                                        {cells(o).map((cell, i) => (
                                             <td key={i}>{cell}</td>
                                        ))}
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               )}
          </div>
     )
}
