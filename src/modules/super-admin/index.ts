/**
 * Super-admin — tok-scan's own console for the staff (guide p.27). Public entry point.
 *
 *   console/shell/           ConsoleShell (charcoal sidebar, top bar) · nav.ts (menu)
 *   console/organizations/   Organizations + Approvals pages, Approve / Suspend actions
 *     edit/                  Edit organization (basics, trial end, owner name + email)
 *   console/server/          getConsoleContext (super-admin only)
 *   console/content/         en · km · zh (`console` namespace)
 *   admin/ · payload.ts      the Payload data admin at /admin (backend entry: ./payload)
 */
export { ApprovalsPage, consoleMetadata, OrganizationsPage } from './console/organizations/page'
export { OrgEditPage, orgEditMetadata } from './console/organizations/edit/page'
export { ConsoleShell } from './console/shell/console-shell'
export type { ConsoleGroupId, ConsoleItemId } from './console/shell/nav'
export type { OrgTab } from './console/organizations/query'
