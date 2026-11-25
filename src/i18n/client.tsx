'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'

import type { SiteLocale } from '@/shared/i18n/site-locale'

import type { Messages, Namespace } from './messages'
import { createTranslator, type Translator } from './translator'

type I18nContextValue = { locale: SiteLocale; messages: Messages }

const I18nContext = createContext<I18nContextValue | null>(null)

/** Mounted once in the (frontend) root layout with the current locale's messages. */
export function I18nProvider({
     locale,
     messages,
     children,
}: I18nContextValue & { children: ReactNode }) {
     const value = useMemo(() => ({ locale, messages }), [locale, messages])
     return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

function useI18n() {
     const ctx = useContext(I18nContext)
     if (!ctx)
          throw new Error('useTranslations must be used inside <I18nProvider> (frontend layout)')
     return ctx
}

/**
 * Client components:
 *
 *   const { t, m, locale } = useTranslations('landing')
 *   t('header.login')
 */
export function useTranslations<N extends Namespace>(
     namespace: N,
): { locale: SiteLocale; t: Translator<Messages[N]>; m: Messages[N] } {
     const { locale, messages } = useI18n()
     const m = messages[namespace]
     const t = useMemo(() => createTranslator(m, namespace), [m, namespace])
     return { locale, t, m }
}

export function useLocale(): SiteLocale {
     return useI18n().locale
}
