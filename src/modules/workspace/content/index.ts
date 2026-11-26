/** `workspace` namespace — the signed-in app shell and dashboard (en · km · zh). */
import type { Translations } from '@/shared/i18n/locales'

import { en, type WorkspaceContent } from './en'
import { km } from './km'
import { zh } from './zh'

export type { WorkspaceContent }

export const workspaceContent: Translations<WorkspaceContent> = { en, km, zh }
