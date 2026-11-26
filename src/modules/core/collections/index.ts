/** Core data (Payload collections) shared by every module. */
import type { CollectionConfig } from 'payload'

import { Media } from './media/collection'

export const coreCollections: CollectionConfig[] = [Media]

/**
 * Tenant-scoped collections (+ multi-tenant plugin options). Media keeps public read
 * (guests see logos), so it uses only our own access rules, not the plugin's read filter.
 */
export const coreTenantScoped = { media: { useTenantAccess: false } }

export { Media }
export { mediaStorage } from './media/storage'
