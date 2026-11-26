/**
 * Cookie consent — the visitor's choice, kept in a cookie so the server can read it too
 * (no banner flash for people who already chose).
 *   'all'        essential + analytics
 *   'essential'  only what tok-scan needs to work (sign-in, language)
 */
export const CONSENT_COOKIE = 'tok-consent'
export const CONSENT_VALUES = ['all', 'essential'] as const
export type Consent = (typeof CONSENT_VALUES)[number]

/** Six months, then we ask again */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180

export function isConsent(value: unknown): value is Consent {
     return (CONSENT_VALUES as readonly unknown[]).includes(value)
}
