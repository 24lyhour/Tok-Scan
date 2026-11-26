/**
 * `onboarding` namespace — sign-up and onboarding steps (guide p.22–23).
 * One file per language (en.ts · km.ts · zh.ts); this file only assembles them.
 * A missing key or language is a type error.
 */
import type { Translations } from '@/shared/i18n/locales'

import { en, type OnboardingContent } from './en'
import { km } from './km'
import { zh } from './zh'

export type { OnboardingContent }

export const onboardingContent: Translations<OnboardingContent> = { en, km, zh }
