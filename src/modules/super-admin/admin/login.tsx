/**
 * /admin/login — Payload `beforeLogin` / `afterLogin` slots. Picks the en · zh texts and renders the
 * shared super-admin components (src/shared/components/super-admin).
 */
import type { I18nClient } from '@payloadcms/translations'

import { authRoutes } from '@/modules/tenancy'
import { LoginIntro, LoginPanel, LoginSwitchLink } from '@/shared/components/super-admin'

import { tr, type PlatformAdminKey } from './translations'

const texts = (i18n: I18nClient) => (key: PlatformAdminKey) => tr(i18n.t, key)

/** Charcoal grid panel on the left (large screens) */
export function AdminLoginPanel({ i18n }: { i18n: I18nClient }) {
     const t = texts(i18n)
     return (
          <LoginPanel
               title={t('panelTitle')}
               points={[t('panelPoint1'), t('panelPoint2'), t('panelPoint3')]}
               pendingLabel={t('panelPending')}
               approveLabel={t('panelApprove')}
               statusLabels={{
                    pending: t('status_pending_approval'),
                    active: t('status_active'),
                    trial: t('status_trial'),
               }}
          />
     )
}

/** Badge + "Welcome back" above the form */
export function AdminLoginIntro({ i18n }: { i18n: I18nClient }) {
     const t = texts(i18n)
     return (
          <LoginIntro
               badge={t('consoleBadge')}
               title={t('loginTitle')}
               subtitle={t('loginSubtitle')}
          />
     )
}

/** "Restaurant owner? Log in to your restaurant" under the form */
export function AdminOwnerLink({ i18n }: { i18n: I18nClient }) {
     const t = texts(i18n)
     return (
          <LoginSwitchLink
               question={t('ownerLogin')}
               label={t('ownerLoginLink')}
               href={authRoutes.login}
          />
     )
}
