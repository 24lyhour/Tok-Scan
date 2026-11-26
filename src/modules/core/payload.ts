/**
 * Backend entry of the core module (Payload only — never import from browser code):
 * collections, storage and admin i18n for the registry (src/modules/index.ts), and the access
 * rules that every module's collections use.
 */
export * from './access'
export { coreCollections, coreTenantScoped, Media, mediaStorage } from './collections'
export { adminI18n, localization } from './i18n'
