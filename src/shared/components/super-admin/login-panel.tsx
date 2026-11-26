import { Check, ShieldCheck } from 'lucide-react'

import { LogoMark } from '@/shared/components/brand/logo'

import styles from './login-panel.module.css'

type Tone = 'pending' | 'active' | 'trial'

/** Sample rows for the illustration — not real data */
const ROWS: { initials: string; name: string; tone: Tone }[] = [
     { initials: 'KS', name: 'Kafe Sabay', tone: 'pending' },
     { initials: 'RK', name: 'Riverside Kitchen', tone: 'active' },
     { initials: 'NB', name: 'Num Banh Chok', tone: 'trial' },
]

/**
 * Charcoal brand panel beside the staff login on large screens (guide p.27: the console looks
 * different from the owners' green app). Grid pattern, glow, logo watermark and a small picture of
 * the approval list. Decorative only; all texts come from the caller.
 */
export function LoginPanel({
     title,
     points,
     pendingLabel,
     approveLabel,
     statusLabels,
}: {
     title: string
     points: string[]
     /** "Pending approvals" */
     pendingLabel: string
     /** "Approve" */
     approveLabel: string
     statusLabels: Record<Tone, string>
}) {
     return (
          <aside className={styles.panel} aria-hidden>
               <div className={styles.grid} />
               <div className={styles.glow} />
               <span className={styles.watermark}>
                    <LogoMark title="" />
               </span>

               <div className={styles.content}>
                    <h2 className={styles.title}>{title}</h2>
                    <ul className={styles.points}>
                         {points.map((point) => (
                              <li key={point}>
                                   <span className={styles.tick}>
                                        <Check size={12} strokeWidth={3} />
                                   </span>
                                   {point}
                              </li>
                         ))}
                    </ul>

                    <div className={styles.preview}>
                         <div className={styles.previewHead}>
                              <span>{pendingLabel}</span>
                              <span className={styles.count}>3</span>
                         </div>
                         {ROWS.map((row) => (
                              <div key={row.name} className={styles.row}>
                                   <span className={styles.avatar} data-tone={row.tone}>
                                        {row.initials}
                                   </span>
                                   <span className={styles.rowName}>{row.name}</span>
                                   <span className={styles.pill} data-tone={row.tone}>
                                        {statusLabels[row.tone]}
                                   </span>
                              </div>
                         ))}
                         <div className={styles.previewFoot}>
                              <span className={styles.approve}>
                                   <ShieldCheck size={14} /> {approveLabel}
                              </span>
                         </div>
                    </div>
               </div>
          </aside>
     )
}
