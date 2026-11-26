/**
 * Locale-aware formatting helpers. Plain functions — safe on server and client.
 */
import { getLocaleConfig, type Locale } from './locales'

/** Fill `{name}` placeholders: interpolate('{n} tables', { n: 16 }) → '16 tables'. Unknown names stay. */
export function interpolate(template: string, values: Record<string, string | number>): string {
     return template.replace(/\{(\w+)\}/g, (match, key: string) =>
          key in values ? String(values[key]) : match,
     )
}

const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']

/** Digits in the reader's script (Khmer numerals for km). Use for counts and steps — not prices. */
export function localizeDigits(value: string | number, locale: Locale): string {
     const text = String(value)
     return locale === 'km' ? text.replace(/\d/g, (d) => khmerDigits[Number(d)]!) : text
}

/** Plural forms of one message. Khmer and Chinese only need `other`. */
export type PluralForms = { one?: string; other: string }

/**
 * Pick the right plural form and fill `{count}`:
 * plural('en', 1, { one: '{count} table', other: '{count} tables' }) → '1 table'
 */
export function plural(locale: Locale, count: number, forms: PluralForms): string {
     const category = new Intl.PluralRules(getLocaleConfig(locale).intl).select(count)
     const template = (category === 'one' && forms.one) || forms.other
     return interpolate(template, { count: localizeDigits(count, locale) })
}

/** Grouped number in the reader's convention, e.g. 125,700 */
export function formatNumber(value: number, locale: Locale): string {
     return localizeDigits(
          new Intl.NumberFormat(getLocaleConfig(locale).intl).format(value),
          locale,
     )
}

export type Currency = 'USD' | 'KHR'

/**
 * Money, written the way Cambodian menus and receipts do (guide p.03) in every language:
 * USD → "$6.50" / "$19", KHR → "KHR 26,700". Latin digits so prices stay readable at a glance.
 */
export function formatMoney(amount: number, currency: Currency = 'USD'): string {
     return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          currencyDisplay: currency === 'USD' ? 'narrowSymbol' : 'code',
          minimumFractionDigits: Number.isInteger(amount) || currency === 'KHR' ? 0 : 2,
          maximumFractionDigits: currency === 'KHR' ? 0 : 2,
     })
          .format(amount)
          .replace(/ /g, ' ')
}
