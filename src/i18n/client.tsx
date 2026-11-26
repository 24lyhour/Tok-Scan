'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'

import type { Locale } from '@/shared/i18n/locales'

import type { Messages, Namespace } from './messages'
import { createTranslator, type Translator } from './translator'

type I18nContextValue = { locale: Locale; messages: Partial<Messages> }

const I18nContext = createContext<I18nContextValue | null>(null)

/**
 * Low-level client provider. Use the server <TranslationsProvider namespaces={[…]}> instead —
 * it picks the messages. Nested providers merge, so a page adds its namespaces to the layout's.
 */
export function I18nProvider({
     locale,
     messages,
     children,
}: I18nContextValue & { children: ReactNode }) {
     const parent = useContext(I18nContext)
     const value = useMemo(
          () => ({ locale, messages: { ...parent?.messages, ...messages } }),
          [locale, messages, parent],
     )
     return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

function useI18n() {
     const ctx = useContext(I18nContext)
     if (!ctx) throw new Error('useTranslations must be used inside <TranslationsProvider>')
     return ctx
}

/**
 * Client components:
 *
 *   const { m, t, locale } = useTranslations('landing')
 *   m.header.login
 *
 * The namespace must be loaded by a <TranslationsProvider> above (layout loads `common`).
 */
export function useTranslations<N extends Namespace>(
     namespace: N,
): { locale: Locale; m: Messages[N]; t: Translator<Messages[N]> } {
     const { locale, messages } = useI18n()
     const m = messages[namespace]
     if (!m) {
          throw new Error(
               `[i18n] Namespace "${namespace}" is not loaded on this page. ` +
                    `Wrap the page in <TranslationsProvider namespaces={['${namespace}']}>.`,
          )
     }
     const t = useMemo(() => createTranslator(m, namespace), [m, namespace])
     return { locale, m, t }
}

export function useLocale(): Locale {
     return useI18n().locale
}
