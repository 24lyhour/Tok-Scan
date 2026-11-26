/**
 * Module registry — the only place payload.config.ts imports backend modules from.
 *
 * Every module has two entry points:
 *   payload.ts  backend: collections, tenant-scoped slugs, plugins  ← imported HERE only
 *   index.ts    public API: pages, components, helpers               ← imported by src/app + other modules
 * Conventions: docs/ARCHITECTURE.md
 */
import type { I18nOptions } from '@payloadcms/translations'
import type { CollectionConfig, Plugin } from 'payload'

import {
     adminI18n as coreAdminI18n,
     coreCollections,
     coreTenantScoped,
     mediaStorage,
} from './core/payload'
import { superAdminComponents, superAdminTranslations } from './super-admin/payload'
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

/** Payload admin = tok-scan's super-admin console: languages + our console texts. */
export const adminI18n: I18nOptions = {
     ...coreAdminI18n,
     // Payload merges custom keys into its own language packs; its type expects full packs
     translations: superAdminTranslations as unknown as I18nOptions['translations'],
}

/** tok-scan logo + console home in the Payload admin */
export const adminComponents = superAdminComponents

export { localization, Media } from './core/payload'
export { Users } from './tenancy/payload'
