import type { CollectionConfig } from 'payload'

import { anyone, requireTenantManager, tenantManagers, tenantManagersCreate } from '../../access'

/**
 * Media — uploaded images (logos, menu photos). Tenant-scoped: each file belongs to one
 * organization. Files are public (guests see logos and dish photos); only that organization's
 * owner/admins can change or delete them.
 */
export const Media: CollectionConfig = {
     slug: 'media',
     access: {
          read: anyone,
          create: tenantManagersCreate,
          update: tenantManagers,
          delete: tenantManagers,
     },
     hooks: { beforeChange: [requireTenantManager] },
     fields: [
          {
               name: 'alt',
               type: 'text',
               required: true,
          },
     ],
     upload: true,
}
