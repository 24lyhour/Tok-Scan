/**
 * Bot check (Cloudflare Turnstile) on tok-scan's own forms: a branded status line says the visitor
 * is verified, under Cloudflare's own box (shown everywhere). Locally Turnstile uses Cloudflare's
 * test key, which always passes.
 */
import { expect, test } from '@playwright/test'

for (const path of ['/login', '/signup']) {
     test(`${path}: Cloudflare box + branded "Verified" line`, async ({ page }) => {
          await page.goto(path)
          const status = page.getByRole('status').filter({ hasText: 'Cloudflare' })
          await expect(status).toHaveText('Verified · protected by Cloudflare', { timeout: 15000 })
          // The form received a token to send with it
          await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue('')
          // Cloudflare's own box is drawn (inside its shadow DOM) and takes up space
          const box = page.locator('[data-turnstile-box]')
          await expect.poll(async () => (await box.boundingBox())?.height ?? 0).toBeGreaterThan(40)
     })
}
