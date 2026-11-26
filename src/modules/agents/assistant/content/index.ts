/** `assistant` namespace — TOKSCAN chat widget text (en · km · zh). */
import type { Translations } from '@/shared/i18n/locales'

import { en, type AssistantContent } from './en'
import { km } from './km'
import { zh } from './zh'

export type { AssistantContent }

export const assistantContent: Translations<AssistantContent> = { en, km, zh }
