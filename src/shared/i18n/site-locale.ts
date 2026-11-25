/**
 * Website language (landing, sign-up, onboarding, staff app) — chosen with the EN / ខ្មែរ / 中文 switch
 * and kept in a cookie. Plain data only, safe to import from client components.
 * Same codes as the Payload content locales in src/modules/core/i18n.
 */
export const siteLocales = ['en', 'km', 'zh'] as const

export type SiteLocale = (typeof siteLocales)[number]

export const defaultSiteLocale: SiteLocale = 'en'

export const SITE_LOCALE_COOKIE = 'tok-locale'

export const siteLocaleLabels: Record<SiteLocale, string> = {
     en: 'EN',
     km: 'ខ្មែរ',
     zh: '中文',
}

export function isSiteLocale(value: unknown): value is SiteLocale {
     return typeof value === 'string' && (siteLocales as readonly string[]).includes(value)
}

/** Every translated text bundle must provide every site locale. */
export type Translations<T> = Record<SiteLocale, T>

/** Fill `{name}` placeholders: format('{n} tables', { n: 16 }) → '16 tables' */
export function format(template: string, values: Record<string, string | number>) {
     return template.replace(/\{(\w+)\}/g, (match, key: string) =>
          key in values ? String(values[key]) : match,
     )
}

const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']

/** Show digits in the reader's script (Khmer numerals for km). Use for counts, not prices. */
export function localizeDigits(value: string | number, locale: SiteLocale) {
     const text = String(value)
     return locale === 'km' ? text.replace(/\d/g, (d) => khmerDigits[Number(d)]!) : text
}
