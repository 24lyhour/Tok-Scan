/**
 * Tenancy data (Payload collections). Add a collection here and it is registered everywhere.
 *
 *   users/          people who log in (owner, staff, tok-scan staff)
 *   organizations/  the tenant: one restaurant business
 *   outlets/        branches of an organization
 */
import type { CollectionConfig } from 'payload'

import { Organizations } from './organizations/collection'
import { Outlets } from './outlets/collection'
import { Users } from './users/collection'

export const tenancyCollections: CollectionConfig[] = [Users, Organizations, Outlets]

/** Collections the multi-tenant plugin scopes to an organization (adds a `tenant` field). */
export const tenancyTenantScoped = { outlets: {} }

export { Organizations, Outlets, Users }
