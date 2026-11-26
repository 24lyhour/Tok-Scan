/**
 * THE language list for tok-scan — used by the website, the Payload content locales and the admin.
 * Add a language here once; TypeScript then lists every place that needs its translations.
 *
 * Plain data, no server imports: safe in client components.
 */
export const locales = [
     {
          code: 'en',
          label: 'English',
          /** The language's own name — what a language picker should show */
          nativeLabel: 'English',
          /** Compact label for the EN / ខ្មែរ / 中文 switch */
          short: 'EN',
          /** BCP 47 tag for Intl (numbers, plurals, dates) */
          intl: 'en-US',
          /** <html lang> value */
          htmlLang: 'en',
          /** Cloudflare Turnstile widget language */
          turnstile: 'en',
     },
     {
          code: 'km',
          label: 'Khmer',
          nativeLabel: 'ខ្មែរ',
          short: 'ខ្មែរ',
          intl: 'km-KH',
          htmlLang: 'km',
          // Turnstile has no Khmer UI yet — follow the browser language
          turnstile: 'auto',
     },
     {
          code: 'zh',
          label: 'Chinese',
          nativeLabel: '中文',
          short: '中文',
          intl: 'zh-CN',
          htmlLang: 'zh-Hans',
          turnstile: 'zh-cn',
     },
] as const

export type LocaleConfig = (typeof locales)[number]
export type Locale = LocaleConfig['code']

export const localeCodes: readonly Locale[] = locales.map((l) => l.code)

export const defaultLocale: Locale = 'en'

/** Cookie holding the visitor's chosen language (set by the language switch). */
export const LOCALE_COOKIE = 'tok-locale'

export function isLocale(value: unknown): value is Locale {
     return typeof value === 'string' && (localeCodes as readonly string[]).includes(value)
}

export function getLocaleConfig(code: Locale): LocaleConfig {
     return locales.find((l) => l.code === code) ?? locales[0]
}

/** A translated bundle must provide every locale — a missing language is a type error. */
export type Translations<T> = Record<Locale, T>
