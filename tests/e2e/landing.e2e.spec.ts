/**
 * Landing page extras: cookie consent banner and the TOKSCAN assistant (UI preview).
 */
import { expect, test } from '@playwright/test'

const shots = process.env.E2E_SCREENSHOTS // optional folder for screenshots

test('cookie banner: both choices work and are remembered', async ({ page }) => {
     await page.goto('/')
     const banner = page.getByRole('region', { name: 'Cookie consent' })
     await expect(banner).toBeVisible()
     await page.getByRole('button', { name: 'Essential only' }).click()
     await expect(banner).toBeHidden()

     const cookies = await page.context().cookies()
     expect(cookies.find((c) => c.name === 'tok-consent')?.value).toBe('essential')

     await page.reload()
     await expect(page.getByRole('region', { name: 'Cookie consent' })).toHaveCount(0)
})

test('TOKSCAN: greeting, answers, full screen', async ({ page }) => {
     await page.goto('/')

     // Greeting waves hello on first open — together with the cookie banner
     const greeting = page.getByText('How can tok-scan help you?')
     await expect(greeting).toBeVisible({ timeout: 5000 })
     await expect(page.getByRole('region', { name: 'Cookie consent' })).toBeVisible()
     if (shots) await page.screenshot({ path: `${shots}/tokscan-first-open.png` })
     await page.getByRole('button', { name: 'Accept all' }).click()
     await greeting.click()

     const chat = page.getByRole('dialog', { name: 'TOKSCAN' })
     await expect(chat).toBeVisible()

     // Suggested question → ready-made answer with the real starting price
     await page.getByRole('button', { name: 'How much does it cost?' }).click()
     await expect(chat.getByText(/Plans start at \$19/)).toBeVisible()

     // Typed question → matched by keywords
     await page.getByRole('textbox', { name: 'Ask TOKSCAN…' }).fill('Can guests pay with ABA?')
     await page.keyboard.press('Enter')
     await expect(chat.getByText(/bank confirms/)).toBeVisible()

     // Full screen: fills the window, page behind stops scrolling
     await page.getByRole('button', { name: 'Full screen' }).click()
     const viewport = page.viewportSize()!
     const box = (await chat.boundingBox())!
     expect(box.width).toBe(viewport.width)
     expect(box.height).toBe(viewport.height)
     expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')
     if (shots) await page.screenshot({ path: `${shots}/tokscan-fullscreen.png` })

     // Esc: leave full screen first, then close
     await page.keyboard.press('Escape')
     await expect(page.getByRole('button', { name: 'Full screen' })).toBeVisible()
     expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
     await page.keyboard.press('Escape')
     await expect(chat).toBeHidden()
     await expect(page.getByRole('button', { name: 'Chat with TOKSCAN' })).toBeFocused()

     // Greeting only once per session
     await page.reload()
     await page.waitForTimeout(2500)
     await expect(page.getByText('How can tok-scan help you?')).toHaveCount(0)
})

test('TOKSCAN full screen on a phone', async ({ browser }) => {
     const context = await browser.newContext({
          viewport: { width: 390, height: 844 },
          isMobile: true,
     })
     await context.addCookies([{ name: 'tok-consent', value: 'all', url: 'http://localhost:3000' }])
     const page = await context.newPage()
     await page.goto('/')
     await page.getByRole('button', { name: 'Chat with TOKSCAN' }).click()
     await page.getByRole('button', { name: 'Full screen' }).click()
     const box = (await page.getByRole('dialog', { name: 'TOKSCAN' }).boundingBox())!
     expect(box.width).toBe(390)
     if (shots) await page.screenshot({ path: `${shots}/tokscan-fullscreen-phone.png` })
     await context.close()
})

test('phone, first open: greeting sits above the cookie banner', async ({ browser }) => {
     const context = await browser.newContext({
          viewport: { width: 390, height: 844 },
          isMobile: true,
     })
     const page = await context.newPage()
     await page.goto('/')
     const banner = page.getByRole('region', { name: 'Cookie consent' })
     const launcher = page.getByRole('button', { name: 'Chat with TOKSCAN' })
     await expect(page.getByText('How can tok-scan help you?')).toBeVisible({ timeout: 5000 })
     await page.waitForTimeout(400) // let the button glide into place
     const bannerTop = (await banner.boundingBox())!.y
     const launcherBottom =
          (await launcher.boundingBox())!.y + (await launcher.boundingBox())!.height
     expect(launcherBottom).toBeLessThanOrEqual(bannerTop)
     if (shots) await page.screenshot({ path: `${shots}/tokscan-first-open-phone.png` })

     // After the choice the button drops back to the corner
     await page.getByRole('button', { name: 'Accept all' }).click()
     await page.waitForTimeout(400)
     const box = (await launcher.boundingBox())!
     expect(844 - (box.y + box.height)).toBeLessThan(40)
     await context.close()
})
