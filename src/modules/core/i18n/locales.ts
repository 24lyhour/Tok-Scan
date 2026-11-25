/**
 * Content locales — the languages a restaurant can publish its menu, receipts and pages in.
 * Guide p.25: "Menu languages: English · Khmer · Chinese".
 *
 * Plain data with no Payload imports, so frontend code (language toggles, customer menu) can use it too.
 */
export const locales = [
     { code: 'en', label: 'English', nativeLabel: 'English' },
     { code: 'km', label: 'Khmer', nativeLabel: 'ខ្មែរ' },
     { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
] as const

export type LocaleCode = (typeof locales)[number]['code']

export const defaultLocale: LocaleCode = 'en'

export const localeCodes = locales.map((l) => l.code) as LocaleCode[]

export function isLocaleCode(value: unknown): value is LocaleCode {
     return typeof value === 'string' && (localeCodes as string[]).includes(value)
}
