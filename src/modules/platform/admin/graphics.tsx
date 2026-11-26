import type { I18nClient } from '@payloadcms/translations'

import { authRoutes } from '@/modules/tenancy'
import { LogoMark } from '@/shared/components/brand/logo'

import styles from './console.module.css'
import { tr } from './translations'

/** Login page logo: tok-scan mark + "Platform console" (Payload `admin.components.graphics.Logo`). */
export function AdminLogo({ i18n }: { i18n?: I18nClient }) {
     return (
          <span className={styles.brand}>
               <span className={styles.brandMark}>
                    <LogoMark tile title="" />
               </span>
               <span className={styles.brandText}>
                    <span className={styles.brandName}>tok·scan</span>
                    <span className={styles.brandTag}>
                         {i18n ? tr(i18n.t, 'console') : 'Platform console'}
                    </span>
               </span>
          </span>
     )
}

/** Small mark in the admin navigation (Payload `admin.components.graphics.Icon`). */
export function AdminIcon() {
     return <LogoMark tile title="tok-scan" />
}

/**
 * Under the logo on /admin/login (Payload `admin.components.beforeLogin`): this login is for staff;
 * restaurant owners are sent to their own login.
 */
export function AdminLoginNote({ i18n }: { i18n?: I18nClient }) {
     const t = (key: Parameters<typeof tr>[1], fallback: string) =>
          i18n ? tr(i18n.t, key) : fallback
     return (
          <p className={styles.loginNote}>
               {t('staffOnly', 'For the tok-scan team only.')}{' '}
               {t('ownerLogin', 'Restaurant owner?')}{' '}
               <a href={authRoutes.login}>{t('ownerLoginLink', 'Log in to your restaurant')}</a>
          </p>
     )
}
