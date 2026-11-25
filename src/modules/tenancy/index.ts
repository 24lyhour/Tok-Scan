/**
 * Module 14 — Organization / Tenant
 * Spec: docs/modules/14-organization-tenant.md
 *
 * Sub-modules (planned): organizations, outlets, members, invitations, onboarding, switcher, branding
 */
import type { CollectionConfig } from 'payload'

import { Users } from './users/collection'

export const tenancyCollections: CollectionConfig[] = [Users]

export { Users }
