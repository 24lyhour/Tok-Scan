/**
 * URLs of the signed-in app (route group `src/app/(frontend)/(app)`) — the one place they are
 * written. Used by the sidebar menu, onboarding redirects and server actions.
 */
export const APP_ROUTES = {
     dashboard: '/dashboard',
     tables: '/tables',
} as const

/** tok-scan super-admin console (guide p.27) — route `src/app/(frontend)/console`. */
export const CONSOLE_ROUTES = {
     home: '/console',
     organizations: '/console/organizations',
     approvals: '/console/approvals',
     /** Payload's raw data admin (edit any record) */
     dataAdmin: '/admin',
} as const
