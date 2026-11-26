/**
 * Global message catalog — every translated namespace, for every locale (en · km · zh).
 *
 * Add a namespace in ONE place: create a `content/` folder in your module (en.ts · km.ts · zh.ts +
 * index.ts exporting `Translations<…>`), then add it to `catalog` below. Import the content folder
 * directly (not the module index) to avoid import cycles. Types update automatically.
 */
import { assistantContent } from '@/modules/assistant/content'
import { consentContent } from '@/modules/marketing/consent/content'
import { landingContent } from '@/modules/marketing/landing/content'
import { authContent } from '@/modules/tenancy/auth/content'
import { onboardingContent } from '@/modules/tenancy/onboarding/content'
import { workspaceContent } from '@/modules/workspace/content'
import type { Locale, Translations } from '@/shared/i18n/locales'

import { commonMessages } from './common'

const catalog = {
     common: commonMessages,
     landing: landingContent,
     onboarding: onboardingContent,
     auth: authContent,
     assistant: assistantContent,
     consent: consentContent,
     workspace: workspaceContent,
} satisfies Record<string, Translations<object>>

type Catalog = typeof catalog
export type Namespace = keyof Catalog
export type Messages = { [N in Namespace]: Catalog[N][Locale] }

/** One namespace in one locale. */
export function getNamespace<N extends Namespace>(locale: Locale, namespace: N): Messages[N] {
     return catalog[namespace][locale] as Messages[N]
}

/** Only the namespaces a page needs — what gets serialized to the browser. */
export function getMessages<N extends Namespace>(
     locale: Locale,
     namespaces: readonly N[],
): Pick<Messages, N> {
     return Object.fromEntries(namespaces.map((n) => [n, getNamespace(locale, n)])) as Pick<
          Messages,
          N
     >
}
