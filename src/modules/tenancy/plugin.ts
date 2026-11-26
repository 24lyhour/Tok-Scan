import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import type { MultiTenantPluginConfig } from '@payloadcms/plugin-multi-tenant/types'
import type { Plugin } from 'payload'

import { isSuperAdmin, ORG_ROLES } from '@/modules/core'

/** Tenant-scoped collections: slug → plugin options ({} = defaults) */
export type TenantScoped = NonNullable<MultiTenantPluginConfig['collections']>

/**
 * Payload multi-tenant plugin: Organization = tenant (Module 14 §3, §5).
 * - Adds `tenant` (→ organizations) to every collection in `scoped`, and limits queries to the
 *   user's own organizations
 * - Adds `tenants[]` to users: one row per membership, with an `orgRole` (only super-admins can
 *   edit it through the API)
 * - Super-admins (users.platformRole) see every organization
 * Role checks inside an organization: core/access.ts.
 */
export function tenancyPlugin(scoped: TenantScoped): Plugin {
     return multiTenantPlugin({
          tenantsSlug: 'organizations',
          // Never cascade-delete financial data: organizations are closed, not deleted
          cleanupAfterTenantDelete: false,
          userHasAccessToAllTenants: (user) => isSuperAdmin(user as { platformRole?: string }),
          tenantsArrayField: {
               includeDefaultField: true,
               rowFields: [
                    {
                         name: 'orgRole',
                         type: 'select',
                         required: true,
                         defaultValue: 'member',
                         options: [...ORG_ROLES],
                    },
               ],
          },
          collections: scoped,
     })
}
