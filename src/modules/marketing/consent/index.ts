/**
 * marketing/consent — cookie consent banner (essential / all), choice kept in the `tok-consent`
 * cookie for six months. Analytics must check `getConsent()` / `useConsent()` before loading.
 */
export { CookieBanner } from './components/cookie-banner'
export { CONSENT_COOKIE, type Consent } from './consent'
export { getConsent } from './server'
export { useConsent } from './use-consent'
