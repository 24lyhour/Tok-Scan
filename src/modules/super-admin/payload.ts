/**
 * Backend entry of the super-admin module (tok-scan's super-admin console, Module 16 — phase 1:
 * the Payload admin). Imported only by src/modules/index.ts.
 *
 *   admin/translations.ts      en · zh texts
 *   admin/login.tsx            /admin/login slots (texts → shared components)
 *   admin/console-overview.tsx /admin home (loads data → shared ConsoleView)
 * The look itself is global: src/shared/components/super-admin.
 */
import type { Config } from 'payload'

export { superAdminTranslations } from './admin/translations'

/** Payload resolves these paths from src/ (admin.importMap.baseDir) — `yarn generate:importmap`. */
const ui = (component: string) => `/shared/components/super-admin#${component}`
const admin = (file: string, component: string) => `/modules/super-admin/admin/${file}#${component}`

export const superAdminComponents: NonNullable<NonNullable<Config['admin']>['components']> = {
     providers: [ui('AdminTheme')],
     graphics: { Logo: ui('AdminLogo'), Icon: ui('AdminIcon') },
     beforeLogin: [admin('login', 'AdminLoginPanel'), admin('login', 'AdminLoginIntro')],
     afterLogin: [ui('AdminLoginCaptcha'), admin('login', 'AdminOwnerLink')],
     beforeDashboard: [admin('console-overview', 'ConsoleOverview')],
}
