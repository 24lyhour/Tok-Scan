/**
 * The public address of the app, e.g. "https://tok-scan.store".
 *
 * - Production: from CANONICAL_HOST (set on Vercel) — the one domain everything should use.
 * - Vercel preview deployments: their own *.vercel.app address.
 * - Local development: '' (unset) — Payload then accepts any localhost port.
 *
 * Payload uses it for absolute API / media / admin / email links, and only accepts its auth cookie
 * from this origin (CSRF protection). Safe to import anywhere on the server.
 */
export function getServerURL(): string {
     const canonicalHost = process.env.CANONICAL_HOST?.trim().toLowerCase()
     if (canonicalHost) return `https://${canonicalHost}`
     if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
          return `https://${process.env.VERCEL_URL}`
     }
     return ''
}
