import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import type { MultiTenantPluginConfig } from '@payloadcms/plugin-multi-tenant/types'
import type { ArrayField, Plugin } from 'payload'

import { isSuperAdmin, ORG_ROLES, superAdminOnly } from '@/modules/core/payload'

/** Tenant-scoped collections: slug → plugin options ({} = defaults) */
export type TenantScoped = NonNullable<MultiTenantPluginConfig['collections']>

/**
 * `users.tenants[]`: the organizations an owner/staff member belongs to, one row per membership with
 * an `orgRole`. Only tok-scan staff can change it through the API (onboarding sets it in server code).
 * Added to `users` here, not by the plugin: the plugin would put it on Payload's admin login table,
 * which is `admins` (tok-scan staff, who belong to no organization).
 */
export const membershipsField = (): ArrayField =>
     tenantsArrayField({
          tenantsCollectionSlug: 'organizations',
          arrayFieldAccess: { create: superAdminOnly, update: superAdminOnly },
          rowFields: [
               {
                    name: 'orgRole',
                    type: 'select',
                    required: true,
                    defaultValue: 'member',
                    options: [...ORG_ROLES],
               },
          ],
     })

/**
 * Payload multi-tenant plugin: Organization = tenant (Module 14 §3, §5).
 * - Adds `tenant` (→ organizations) to every collection in `scoped`, and limits queries to the
 *   signed-in owner's organizations (read from `users.tenants[]`, see membershipsField)
 * - tok-scan staff (the `admins` table) see every organization
 * Role checks inside an organization: core/access.ts.
 */
export function tenancyPlugin(scoped: TenantScoped): Plugin {
     return multiTenantPlugin({
          tenantsSlug: 'organizations',
          // Never cascade-delete financial data: organizations are closed, not deleted
          cleanupAfterTenantDelete: false,
          userHasAccessToAllTenants: (user) => isSuperAdmin(user as { collection?: string }),
          // users.tenants[] comes from membershipsField (on `users`, not the admin login table)
          tenantsArrayField: { includeDefaultField: false },
          collections: scoped,
     })
}
