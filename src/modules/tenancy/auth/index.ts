/**
 * tenancy/auth — tok-scan login (replaces Payload's generic admin login for owners and staff).
 *
 *   login/     page · form · schema · actions · aside   (same layout as every onboarding step)
 *   google/    "Continue with Google" (OpenID Connect)
 *   server/    session cookie + current user
 *   routes.ts  URLs  ·  errors.ts  error codes  ·  content/  en · km · zh (`auth` namespace)
 */
export { finishGoogleSignIn, startGoogleSignIn } from './google/routes'
export { LoginPage, loginMetadata } from './login/page'
export { LogoutButton } from './logout-button'
export { authRoutes } from './routes'
export type { AuthContent } from './content'
