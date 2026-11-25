/**
 * Module registry — the only place payload.config.ts imports backend modules from.
 *
 * When you add a module: create src/modules/<module>/index.ts that exports
 * `<module>Collections` (and later `<module>Globals` / plugin fragments), then add it below.
 * Conventions: docs/ARCHITECTURE.md
 */
import type { CollectionConfig } from 'payload'

import { coreCollections } from './core'
import { tenancyCollections } from './tenancy'

export const collections: CollectionConfig[] = [...tenancyCollections, ...coreCollections]

export { Users } from './tenancy'
export { Media } from './core'
