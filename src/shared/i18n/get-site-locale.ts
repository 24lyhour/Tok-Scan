import { cookies } from 'next/headers'

import { defaultSiteLocale, isSiteLocale, SITE_LOCALE_COOKIE, type SiteLocale } from './site-locale'

/** Server-side: the visitor's chosen website language (cookie), falling back to English. */
export async function getSiteLocale(): Promise<SiteLocale> {
     const value = (await cookies()).get(SITE_LOCALE_COOKIE)?.value
     return isSiteLocale(value) ? value : defaultSiteLocale
}
