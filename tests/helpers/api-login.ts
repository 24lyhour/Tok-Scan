import { expect, type Page } from '@playwright/test'

import { TURNSTILE_COOKIE } from '@/shared/security/turnstile-config'

/**
 * Cloudflare's dummy token. Locally (and in CI) Turnstile runs with Cloudflare's test keys, which
 * accept it; real production keys reject it.
 */
export const TEST_CAPTCHA_TOKEN = 'XXXX.DUMMY.TOKEN.XXXX'

/** Sign in through Payload's login API — it needs the bot-check token, like the /admin form. */
export async function apiLogin(page: Page, user: { email: string; password: string }) {
     const res = await page.request.post('/api/users/login', {
          data: { email: user.email, password: user.password },
          headers: { cookie: `${TURNSTILE_COOKIE}=${TEST_CAPTCHA_TOKEN}` },
     })
     expect(res.ok()).toBe(true)
}
