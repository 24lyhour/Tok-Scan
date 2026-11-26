/** Tables data (Payload collections). */
import type { CollectionConfig } from 'payload'

import { Tables } from './tables/collection'

export const tablesCollections: CollectionConfig[] = [Tables]

/** Collections the multi-tenant plugin scopes to an organization. */
export const tablesTenantScoped = { tables: {} }

export { Tables }
