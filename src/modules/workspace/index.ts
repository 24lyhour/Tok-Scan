/**
 * Workspace — the signed-in app (guide p.8 / p.24): sidebar with organization/outlet switcher,
 * top bar, and the pages inside it. Every staff/owner page (menu, orders, staff …) renders in
 * <AppShell>.
 *
 *   shell/       AppShell · Sidebar · Switcher · nav.ts (menu items)
 *   dashboard/   owner dashboard: go-live checklist, numbers, live tables
 *   server/      getWorkspaceContext (owner, organization, outlet, plan, checklist)
 *   content/     en · km · zh (`workspace` namespace)
 */
export { DashboardPage, dashboardMetadata } from './dashboard/page'
export { AppShell } from './shell/app-shell'
export type { NavGroupId, NavItemId } from './shell/nav'
