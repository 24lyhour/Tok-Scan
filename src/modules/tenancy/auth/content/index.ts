/**
 * `auth` namespace — login screen copy.
 * One file per language (en.ts · km.ts · zh.ts); this file only assembles them.
 * A missing key or language is a type error.
 */
import type { Translations } from '@/shared/i18n/locales'

import { en, type AuthContent } from './en'
import { km } from './km'
import { zh } from './zh'

export type { AuthContent }

export const authContent: Translations<AuthContent> = { en, km, zh }
