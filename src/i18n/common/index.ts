/**
 * `common` namespace — loaded on every page: site meta, skip link, buttons, states.
 * One file per language (en.ts · km.ts · zh.ts); this file only assembles them.
 * A missing key or language is a type error.
 */
import type { Translations } from '@/shared/i18n/locales'

import { en, type CommonMessages } from './en'
import { km } from './km'
import { zh } from './zh'

export type { CommonMessages }

/**
 * export the variable to be used in the app everywhere
 */
export const commonMessages: Translations<CommonMessages> = { en, km, zh }
