/**
 * Google sign-in settings. Create an OAuth client (type "Web application") in Google Cloud Console
 * and add these Authorized redirect URIs:
 *   http://localhost:3000/auth/google/callback
 *   https://<your-domain>/auth/google/callback
 */
export const GOOGLE_START_PATH = '/auth/google'
export const GOOGLE_CALLBACK_PATH = '/auth/google/callback'

/** Short-lived cookie holding state / PKCE verifier / nonce between redirect and callback. */
export const GOOGLE_FLOW_COOKIE = 'tok-oauth-google'
export const GOOGLE_FLOW_MAX_AGE = 10 * 60 // seconds

export function getGoogleCredentials(): { clientId: string; clientSecret: string } | null {
     const clientId = process.env.GOOGLE_CLIENT_ID
     const clientSecret = process.env.GOOGLE_CLIENT_SECRET
     return clientId && clientSecret ? { clientId, clientSecret } : null
}

/** True when both env vars are set — the UI only enables the Google button then. */
export function isGoogleEnabled(): boolean {
     return getGoogleCredentials() !== null
}

/** Where a sign-in button links to. `from` = page to return to with errors; `next` = after success. */
export function googleStartHref(from: '/login' | '/signup', next?: string): string {
     const params = new URLSearchParams({ from })
     if (next) params.set('next', next)
     return `${GOOGLE_START_PATH}?${params}`
}

/** Error codes the callback sends back as `?error=` (translated on the login/sign-up page). */
export type GoogleErrorCode = 'cancelled' | 'failed' | 'unverified' | 'unavailable'

export function isGoogleErrorCode(value: unknown): value is GoogleErrorCode {
     return (
          value === 'cancelled' ||
          value === 'failed' ||
          value === 'unverified' ||
          value === 'unavailable'
     )
}
