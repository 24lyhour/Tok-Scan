import type { I18nClient } from '@payloadcms/translations'
import { ShieldCheck } from 'lucide-react'

import { authRoutes } from '@/modules/tenancy'
import { LogoMark } from '@/shared/components/brand/logo'

import styles from './console.module.css'
import { type PlatformAdminKey, tr } from './translations'

/** Payload passes `i18n` to admin components; fall back to English outside the admin. */
const text = (i18n: I18nClient | undefined, key: PlatformAdminKey, fallback: string) =>
     i18n ? tr(i18n.t, key) : fallback

/** Login / forgot-password logo: mark + tok·scan wordmark (Payload `admin.components.graphics.Logo`). */
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

/** Small mark in the admin navigation (Payload `admin.components.graphics.Icon`). */
export function AdminIcon() {
     return <LogoMark tile title="tok-scan" />
}

/** Above the login form (Payload `beforeLogin`): console badge (guide p.27) + heading. */
export function AdminLoginIntro({ i18n }: { i18n?: I18nClient }) {
     return (
          <div className={styles.loginIntro}>
               <span className={styles.consoleBadge}>
                    <ShieldCheck aria-hidden size={14} />
                    {text(i18n, 'consoleBadge', 'Platform console · staff only')}
               </span>
               <h1 className={styles.loginTitle}>{text(i18n, 'loginTitle', 'Welcome back')}</h1>
               <p className={styles.loginSubtitle}>
                    {text(i18n, 'loginSubtitle', 'Log in with your tok-scan staff account.')}
               </p>
          </div>
     )
}

/** Under the login form (Payload `afterLogin`): restaurant owners go to their own login. */
export function AdminOwnerLink({ i18n }: { i18n?: I18nClient }) {
     return (
          <p className={styles.ownerLink}>
               {text(i18n, 'ownerLogin', 'Restaurant owner?')}{' '}
               <a href={authRoutes.login}>
                    {text(i18n, 'ownerLoginLink', 'Log in to your restaurant')}
               </a>
          </p>
     )
}
