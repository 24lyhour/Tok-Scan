import { cookies } from 'next/headers'

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from './locales'

/** Server only: the visitor's chosen language from the cookie, falling back to English. */
export async function getLocale(): Promise<Locale> {
     const value = (await cookies()).get(LOCALE_COOKIE)?.value
     return isLocale(value) ? value : defaultLocale
}
