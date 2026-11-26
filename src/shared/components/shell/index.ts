/**
 * App frame shared by the restaurant app (green, guide p.8) and the super-admin console
 * (charcoal, guide p.27). Modules pass their menu, texts and slots; nothing here knows about data.
 */
export { initials, ShellLayout } from './shell-layout'
export {
     ShellSidebar,
     type ShellNavGroup,
     type ShellNavItem,
     type ShellSidebarLabels,
     type ShellTone,
} from './shell-sidebar'
export { ShellTopbar } from './shell-topbar'
