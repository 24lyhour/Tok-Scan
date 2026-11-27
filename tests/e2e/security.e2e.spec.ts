/**
 * Bot check (Cloudflare Turnstile) on tok-scan's own forms: Cloudflare's grey box stays hidden and
 * a branded status line says the visitor is verified. Locally Turnstile uses Cloudflare's test
 * key, which always passes.
 */
import { expect, test } from '@playwright/test'

for (const path of ['/login', '/signup']) {
     test(`${path}: branded "Verified" line, no Cloudflare box`, async ({ page }) => {
          await page.goto(path)
          const status = page.getByRole('status').filter({ hasText: 'Cloudflare' })
          await expect(status).toHaveText('Verified · protected by Cloudflare', { timeout: 15000 })
          // The form received a token to send with it
          await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue('')
          // Cloudflare's own widget is not shown (it only appears if a click is needed)
          await expect(page.locator('iframe[src*="challenges.cloudflare.com"]')).toBeHidden()
     })
}
