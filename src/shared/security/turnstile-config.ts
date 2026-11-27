/**
 * Cloudflare Turnstile (bot check) — public settings, safe for client components.
 * https://developers.cloudflare.com/turnstile/
 *
 * Without keys in development we use Cloudflare's official *test* site key, which always passes,
 * so the forms work locally. Production must set real keys (see .env.example).
 */
const TEST_SITE_KEY = '1x00000000000000000000AA'

export const turnstileSiteKey =
     process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
     (process.env.NODE_ENV !== 'production' ? TEST_SITE_KEY : '')

/** Name of the hidden input the widget adds to the surrounding <form>. */
export const TURNSTILE_FIELD = 'cf-turnstile-response'

/** Turnstile action names — checked on the server so a login token can't be reused for sign-up. */
export type TurnstileAction = 'login' | 'signup' | 'admin-login' | 'reset'

/**
 * Cookie that carries the token for Payload's own login API (/api/users/login), which the admin
 * login form calls with JSON we can't add fields to. Short-lived, sent only to /api.
 */
export const TURNSTILE_COOKIE = 'tok-captcha'
