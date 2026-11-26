/**
 * Backend entry of the platform module (tok-scan's super-admin console, Module 16 — phase 1:
 * the Payload admin). Imported only by src/modules/index.ts.
 */
import type { Config } from 'payload'

export { platformAdminTranslations } from './admin/translations'

/** Payload admin customisations. Paths are relative to src/ (admin.importMap.baseDir). */
export const platformAdminComponents: NonNullable<NonNullable<Config['admin']>['components']> = {
     graphics: {
          Logo: '/modules/platform/admin/graphics#AdminLogo',
          Icon: '/modules/platform/admin/graphics#AdminIcon',
     },
     beforeDashboard: ['/modules/platform/admin/console-overview#ConsoleOverview'],
     beforeLogin: ['/modules/platform/admin/graphics#AdminLoginNote'],
     providers: ['/modules/platform/admin/theme#AdminTheme'],
}
