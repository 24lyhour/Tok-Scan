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
     /** Staff login (owners use /login) — shows tok-scan's login in staff mode, see next.config */
     login: '/admin/login',
     organizations: '/console/organizations',
     approvals: '/console/approvals',
     /** Edit one organization (support) */
     editOrganization: (id: number | string) => `/console/organizations/${id}/edit`,
     /** Payload's raw data admin (edit any record) */
     dataAdmin: '/admin',
} as const
