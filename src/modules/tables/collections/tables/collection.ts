import type { CollectionConfig } from 'payload'

import {
     requireTenantManager,
     tenantManagers,
     tenantManagersCreate,
     tenantMembers,
} from '@/modules/core'
import { relationId } from '@/shared/lib/payload'

import { TABLE_DEFAULTS, TABLE_LIMITS } from './constants'

/**
 * Tables — one physical table with its own QR code (Module 10, guide p.15).
 * Tenant-scoped (plugin adds `tenant`) AND outlet-scoped. The QR opens
 *   https://<domain>/r/<orgSlug>/t/<label>?k=<qrKey>
 * Regenerating `qrKey` invalidates previously printed codes.
 */
export const Tables: CollectionConfig = {
     slug: 'tables',
     admin: { useAsTitle: 'label', defaultColumns: ['label', 'zone', 'seats', 'outlet', 'active'] },
     access: {
          read: tenantMembers,
          create: tenantManagersCreate,
          update: tenantManagers,
          delete: tenantManagers,
     },
     hooks: { beforeChange: [requireTenantManager] },
     fields: [
          {
               name: 'outlet',
               type: 'relationship',
               relationTo: 'outlets',
               required: true,
               index: true,
               // Only outlets of the table's own organization
               filterOptions: ({ data }) => {
                    const tenant = relationId(data?.tenant as number | { id: number } | undefined)
                    return tenant ? { tenant: { equals: tenant } } : true
               },
          },
          {
               name: 'label',
               type: 'text',
               required: true,
               admin: { description: 'Shown to guests and staff, e.g. T07' },
          },
          { name: 'number', type: 'number', required: true, min: 1 },
          {
               name: 'zone',
               type: 'text',
               defaultValue: TABLE_DEFAULTS.zone,
               maxLength: TABLE_LIMITS.zone,
          },
          { name: 'seats', type: 'number', defaultValue: TABLE_DEFAULTS.seats, min: 1 },
          {
               name: 'qrKey',
               type: 'text',
               required: true,
               admin: {
                    readOnly: true,
                    description: 'Secret part of the QR link — regenerate to revoke printed codes',
               },
          },
          { name: 'active', type: 'checkbox', defaultValue: true },
     ],
}
