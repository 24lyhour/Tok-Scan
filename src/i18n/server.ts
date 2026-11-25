import { getSiteLocale } from '@/shared/i18n/get-site-locale'
import type { SiteLocale } from '@/shared/i18n/site-locale'

import { getMessages, type Messages, type Namespace } from './messages'
import { createTranslator, type Translator } from './translator'

/**
 * Server components, server actions, route handlers, generateMetadata:
 *
 *   const { t, m, locale } = await getTranslations('onboarding')
 *   t('signup.title')                 // typed key → string
 *   t('shell.step', { n: 1, total: 4 })
 *   m.signup.errors                   // raw objects/arrays when you need them
 */
export async function getTranslations<N extends Namespace>(
     namespace: N,
     locale?: SiteLocale,
): Promise<{ locale: SiteLocale; t: Translator<Messages[N]>; m: Messages[N] }> {
     const activeLocale = locale ?? (await getSiteLocale())
     const m = getMessages(activeLocale)[namespace]
     return { locale: activeLocale, t: createTranslator(m, namespace), m }
}

export { getSiteLocale as getLocale }
export { getMessages }
