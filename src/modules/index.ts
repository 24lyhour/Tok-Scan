/**
 * Module registry — the only place payload.config.ts imports backend modules from.
 *
 * Every module has two entry points:
 *   payload.ts  backend: collections, tenant-scoped slugs, plugins  ← imported HERE only
 *   index.ts    public API: pages, components, helpers               ← imported by src/app + other modules
 * Conventions: docs/ARCHITECTURE.md
 */
import type { CollectionConfig, Plugin } from 'payload'

import { coreCollections, coreTenantScoped, mediaStorage } from './core/payload'
import { tablesCollections, tablesTenantScoped } from './tables/payload'
import { tenancyCollections, tenancyPlugin, tenancyTenantScoped } from './tenancy/payload'

export const collections: CollectionConfig[] = [
     ...tenancyCollections,
     ...tablesCollections,
     ...coreCollections,
]

/** Every collection whose rows belong to one organization (Module 14 §5.1). */
const tenantScoped = { ...tenancyTenantScoped, ...tablesTenantScoped, ...coreTenantScoped }

export const plugins: Plugin[] = [tenancyPlugin(tenantScoped), mediaStorage()]

export { adminI18n, localization, Media } from './core/payload'
export { Users } from './tenancy/payload'
