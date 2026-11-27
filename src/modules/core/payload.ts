/**
 * Backend entry of the core module (Payload only — never import from browser code):
 * collections, storage and admin i18n for the registry (src/modules/index.ts), and the access
 * rules that every module's collections use.
 */
export * from './access'
export { ADMIN_GROUPS } from './admin-groups'
export { enforcePlanLimit } from './plan-limits'
export { coreCollections, coreTenantScoped, Media, mediaStorage } from './collections'
export { emailAdapter } from './email'
export { adminI18n, localization } from './i18n'
