/**
 * Access rules for every collection (Module 14 §5.3). Collections use these — never inline
 * `({ req }) => …` — so who-can-do-what is decided in ONE file.
 *
 * Roles: a user belongs to organizations through `users.tenants[]`, each row with an `orgRole`:
 *   owner   — created the organization; everything
 *   admin   — manages setup (outlets, tables, menu, staff)
 *   member  — staff: reads setup, works orders (later modules)
 * tok-scan staff have `users.platformRole = 'super-admin'` and can do everything.
 *
 * The multi-tenant plugin ALSO limits every query to the user's own organizations; these rules
 * add the role checks inside an organization.
 */
import { Forbidden, type Access, type CollectionBeforeChangeHook, type Where } from 'payload'

import { relationId } from '@/shared/lib/payload'

export const ORG_ROLES = ['owner', 'admin', 'member'] as const
export type OrgRole = (typeof ORG_ROLES)[number]

/** Roles allowed to change an organization's setup */
export const MANAGER_ROLES: readonly OrgRole[] = ['owner', 'admin']

type Membership = { tenant?: unknown; orgRole?: string | null }
type AccessUser =
     | {
            id?: number | string
            email?: string | null
            platformRole?: string | null
            tenants?: Membership[] | null
       }
     | null
     | undefined

/** Emails in SUPER_ADMIN_EMAILS (comma-separated) — staff set on the server, no database edit needed. */
function superAdminEmails(): string[] {
     return (process.env.SUPER_ADMIN_EMAILS ?? '')
          .split(',')
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean)
}

/**
 * tok-scan platform staff — full access to every organization: `platformRole = 'super-admin'`,
 * or an email listed in SUPER_ADMIN_EMAILS.
 */
export function isSuperAdmin(user: AccessUser): boolean {
     if (!user) return false
     if (user.platformRole === 'super-admin') return true
     const email = user.email?.trim().toLowerCase()
     return Boolean(email) && superAdminEmails().includes(email!)
}

/** Ids of the organizations where the user has one of `roles`. */
export function orgIdsWithRole(user: AccessUser, roles: readonly OrgRole[] = ORG_ROLES): number[] {
     return (user?.tenants ?? [])
          .filter((m) => roles.includes(m.orgRole as OrgRole))
          .map((m) => relationId(m.tenant as number | { id: number } | null))
          .filter((id): id is number => typeof id === 'number')
}

/* ───────── Simple rules ───────── */

/** Works as collection access AND field access (both receive `{ req }`). */
type ReqArgs = { req: { user?: AccessUser } }

export const anyone = (): boolean => true
export const nobody = (): boolean => false
export const authenticated = ({ req }: ReqArgs): boolean => Boolean(req.user)
export const superAdminOnly = ({ req }: ReqArgs): boolean => isSuperAdmin(req.user)

/* ───────── Organizations (the tenant collection) ───────── */

const inOrgs = (field: string, ids: number[]): Where | false =>
     ids.length ? { [field]: { in: ids } } : false

/** Read an organization: any member of it. */
export const orgMembersRead: Access = ({ req }) =>
     !req.user ? false : isSuperAdmin(req.user) || inOrgs('id', orgIdsWithRole(req.user))

/** Change an organization: its owner or admins. */
export const orgManagersUpdate: Access = ({ req }) =>
     !req.user
          ? false
          : isSuperAdmin(req.user) || inOrgs('id', orgIdsWithRole(req.user, MANAGER_ROLES))

/* ───────── Tenant-scoped collections (outlets, tables, media …) ───────── */

/** Read: members of the document's organization. */
export const tenantMembers: Access = ({ req }) =>
     !req.user ? false : isSuperAdmin(req.user) || inOrgs('tenant', orgIdsWithRole(req.user))

/** Update / delete: owner or admins of the document's organization. */
export const tenantManagers: Access = ({ req }) =>
     !req.user
          ? false
          : isSuperAdmin(req.user) || inOrgs('tenant', orgIdsWithRole(req.user, MANAGER_ROLES))

/**
 * Create: the user manages at least one organization. Which organization the new document
 * belongs to is checked by the `requireTenantManager` hook (create access can't filter).
 */
export const tenantManagersCreate: Access = ({ req }) =>
     isSuperAdmin(req.user) || orgIdsWithRole(req.user, MANAGER_ROLES).length > 0

/**
 * beforeChange hook for tenant-scoped collections: the document's organization must be one the
 * user manages (blocks creating in — or moving a document to — someone else's organization).
 * Server code that runs without a user (onboarding actions, scripts) is not affected.
 */
export const requireTenantManager: CollectionBeforeChangeHook = ({ req, data, originalDoc }) => {
     const user = req.user as AccessUser
     if (!user || isSuperAdmin(user)) return data
     const tenant = relationId((data?.tenant ?? originalDoc?.tenant) as number | { id: number })
     if (tenant === undefined || !orgIdsWithRole(user, MANAGER_ROLES).includes(tenant)) {
          throw new Forbidden(req.t)
     }
     return data
}

/* ───────── Users ───────── */

/** Read users: yourself and people in your organizations. */
export const usersRead: Access = ({ req }) => {
     if (!req.user) return false
     if (isSuperAdmin(req.user)) return true
     const where: Where = {
          or: [
               { id: { equals: req.user.id } },
               { 'tenants.tenant': { in: orgIdsWithRole(req.user) } },
          ],
     }
     return where
}

/** Change a user: only yourself (owners manage staff through server actions, not the API). */
export const selfOrSuperAdmin: Access = ({ req }) =>
     !req.user ? false : isSuperAdmin(req.user) || { id: { equals: req.user.id } }
