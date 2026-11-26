import type { ReactNode } from 'react'

import { getLocale } from '@/shared/i18n/get-locale'

import { I18nProvider } from './client'
import { getMessages, type Namespace } from './messages'

/**
 * Server component: sends ONLY the listed namespaces to the browser for client components.
 * - Root layout: <TranslationsProvider namespaces={['common']}>
 * - A page:      <TranslationsProvider namespaces={['auth']}>  (merges with `common`)
 * Server components don't need this — they call getTranslations() directly.
 */
export async function TranslationsProvider({
     namespaces,
     children,
}: {
     namespaces: readonly Namespace[]
     children: ReactNode
}) {
     const locale = await getLocale()
     return (
          <I18nProvider locale={locale} messages={getMessages(locale, namespaces)}>
               {children}
          </I18nProvider>
     )
}
