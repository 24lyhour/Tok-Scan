/**
 * Landing page content.
 * - data.ts  links, prices, ids, numbers (shared, never translated)
 * - types.ts the LandingContent shape every language must match
 * - en.ts · km.ts · zh.ts  one file per language
 */
import type { Translations } from '@/shared/i18n/locales'

import { en } from './en'
import { km } from './km'
import type { LandingContent } from './types'
import { zh } from './zh'

export * from './data'
export type { LandingContent }

export const landingContent: Translations<LandingContent> = { en, km, zh }
