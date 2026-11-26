import { ShieldCheck } from 'lucide-react'

import styles from './login.module.css'

/** Heading above a staff login form: console badge (guide p.27) + title + subtitle. */
export function LoginIntro({
     badge,
     title,
     subtitle,
}: {
     badge: string
     title: string
     subtitle: string
}) {
     return (
          <div className={styles.loginIntro}>
               <span className={styles.consoleBadge}>
                    <ShieldCheck aria-hidden size={14} />
                    {badge}
               </span>
               <h1 className={styles.loginTitle}>{title}</h1>
               <p className={styles.loginSubtitle}>{subtitle}</p>
          </div>
     )
}

/** One line under a login form: "Restaurant owner? Log in to your restaurant". */
export function LoginSwitchLink({
     question,
     label,
     href,
}: {
     question: string
     label: string
     href: string
}) {
     return (
          <p className={styles.ownerLink}>
               {question} <a href={href}>{label}</a>
          </p>
     )
}
