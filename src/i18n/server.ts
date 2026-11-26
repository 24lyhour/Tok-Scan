import { getLocale } from '@/shared/i18n/get-locale'
import type { Locale } from '@/shared/i18n/locales'

import { getNamespace, type Messages, type Namespace } from './messages'
import { createTranslator, type Translator } from './translator'

/**
 * Server components, server actions, route handlers, generateMetadata.
 * Works for any namespace — no provider needed on the server.
 *
 *   const { m, t, locale } = await getTranslations('onboarding')
 *   m.signup.title                       // read copy (typed)
 *   t('shell.step', { n: 1, total: 4 })  // when you need {placeholders}
 */
export async function getTranslations<N extends Namespace>(
     namespace: N,
     locale?: Locale,
): Promise<{ locale: Locale; m: Messages[N]; t: Translator<Messages[N]> }> {
     const activeLocale = locale ?? (await getLocale())
     const m = getNamespace(activeLocale, namespace)
     return { locale: activeLocale, m, t: createTranslator(m, namespace) }
}

export { getLocale }
