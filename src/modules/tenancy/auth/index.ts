/**
 * tenancy/auth — tok-scan login (replaces Payload's generic admin login for owners and staff).
 * Text: `auth` namespace of the global i18n catalog (src/i18n).
 */
export { LoginPage, loginMetadata } from './login-page'
export { authRoutes } from './paths'
export { finishGoogleSignIn, startGoogleSignIn } from './google/routes'
export type { AuthContent } from './content'
