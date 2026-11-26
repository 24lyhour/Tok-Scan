import { LogoMark } from '@/shared/components/brand/logo'

import styles from './logo.module.css'

/** Admin login / forgot-password logo: mark + tok·scan wordmark (Payload `graphics.Logo`). */
export function AdminLogo() {
     return (
          <span className={styles.brand}>
               <span className={styles.brandMark}>
                    <LogoMark tile title="" />
               </span>
               <span className={styles.brandText}>
                    <span className={styles.brandName}>
                         tok<span className={styles.brandDot}>·</span>scan
                    </span>
                    <span className={styles.brandTag}>SCAN · ORDER · PAY</span>
               </span>
          </span>
     )
}

/** Small mark in the admin navigation (Payload `graphics.Icon`). */
export function AdminIcon() {
     return <LogoMark tile title="tok-scan" />
}
