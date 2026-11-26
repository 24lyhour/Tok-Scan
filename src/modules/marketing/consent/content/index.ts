/** `consent` namespace — cookie banner text (en · km · zh). */
import type { Translations } from '@/shared/i18n/locales'

import { en, type ConsentContent } from './en'
import { km } from './km'
import { zh } from './zh'

export type { ConsentContent }

export const consentContent: Translations<ConsentContent> = { en, km, zh }
