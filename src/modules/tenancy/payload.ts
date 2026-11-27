/** Backend entry of the tenancy module — imported only by src/modules/index.ts. */
export { tenancyCollections, tenancyTenantScoped, Users } from './collections'
export { tenancyPlugin } from './plugin'
/** Branded reset email for an auth table (the super-admin module's `admins` uses it too) */
export { brandedForgotPassword } from './auth/password-reset/email'
