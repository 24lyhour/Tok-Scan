import type { ReactNode } from 'react'

import styles from './console.module.css'

export type ConsoleStat = {
     label: string
     value: number
     href: string
     /** Highlight (e.g. restaurants waiting for approval) */
     warn?: boolean
}

export type ConsoleRow = {
     id: string | number
     name: string
     href: string
     /** Small line under the name, e.g. "/r/mahob" */
     sub?: string
     /** The other columns */
     cells: ReactNode[]
}

export type ConsolePanel = {
     title: string
     /** Shown when there are no rows */
     empty: string
     action: { href: string; label: string }
     columns: string[]
     rows: ConsoleRow[]
}

/**
 * Super-admin console home (guide p.27): title, stat cards, then list panels side by side.
 * Pure layout — the caller loads the data and passes the texts.
 */
export function ConsoleView({
     title,
     subtitle,
     stats,
     panels,
}: {
     title: string
     subtitle: string
     stats: ConsoleStat[]
     panels: ConsolePanel[]
}) {
     return (
          <section className={styles.console}>
               <h2 className={styles.title}>{title}</h2>
               <p className={styles.subtitle}>{subtitle}</p>

               <div className={styles.stats}>
                    {stats.map((stat) => (
                         <a
                              key={stat.label}
                              href={stat.href}
                              className={`${styles.stat} ${stat.warn ? styles.statWarn : ''}`}
                         >
                              <div className={styles.statLabel}>{stat.label}</div>
                              <div className={styles.statValue}>{stat.value}</div>
                         </a>
                    ))}
               </div>

               <div className={styles.panels}>
                    {panels.map((panel) => (
                         <Panel key={panel.title} {...panel} />
                    ))}
               </div>
          </section>
     )
}

function Panel({ title, empty, action, columns, rows }: ConsolePanel) {
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
                              {rows.map((row) => (
                                   <tr key={row.id}>
                                        <td>
                                             <a href={row.href}>{row.name}</a>
                                             {row.sub && (
                                                  <div className={styles.muted}>{row.sub}</div>
                                             )}
                                        </td>
                                        {row.cells.map((cell, i) => (
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

/** Organization status pill — colours per status, Payload theme aware (light + dark). */
export function StatusBadge({
     status,
     label,
}: {
     status: 'trial' | 'pending_approval' | 'active' | 'suspended' | 'closed'
     label: string
}) {
     return <span className={`${styles.badge} ${styles[`badge_${status}`]}`}>{label}</span>
}
