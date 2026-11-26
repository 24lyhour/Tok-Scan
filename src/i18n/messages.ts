/**
 * Global message catalog — every text of the site, one folder per language:
 *
 *   src/i18n/en/   English — the source of truth (each file's type is what km and zh must match)
 *   src/i18n/km/   Khmer
 *   src/i18n/zh/   Chinese
 *
 * Add a namespace: create `<name>.ts` in en/, km/ and zh/, then export it from each folder's
 * index.ts. A missing namespace, key or language is a type error.
 */
import type { Locale } from '@/shared/i18n/locales'

import * as en from './en'
import * as km from './km'
import * as zh from './zh'

type Catalog = typeof en
export type Namespace = keyof Catalog
export type Messages = { [N in Namespace]: Catalog[N] }

/** Every language must provide every namespace with the English shape. */
const catalog: Record<Locale, Catalog> = { en, km, zh }

/** One namespace in one locale. */
export function getNamespace<N extends Namespace>(locale: Locale, namespace: N): Messages[N] {
     return catalog[locale][namespace]
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

/** Text types for components that receive copy as props, e.g. `m: ConsoleContent`. */
export type {
     AssistantContent,
     AuthContent,
     CommonMessages,
     ConsentContent,
     ConsoleContent,
     LandingContent,
     OnboardingContent,
     WorkspaceContent,
} from './en'
