/**
 * Restaurant onboarding, end to end (guide p.22–23):
 * step 2 organization → step 3 outlet → step 4 tables → print sheet → dashboard (+ Khmer).
 */
import { expect, test } from '@playwright/test'

import { apiLogin } from '../helpers/api-login'
import { resetTestOwner, testOwner } from '../helpers/test-owner'

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
     await resetTestOwner()
})

test('a new owner sets up a restaurant', async ({ page, context }) => {
     // Sign in through the API (the login form has its own captcha-protected flow)
     await apiLogin(page, testOwner)

     await page.goto('/onboarding')
     await expect(page).toHaveURL(/\/onboarding\/organization$/)

     await test.step('step 2 · organization', async () => {
          const submit = page.getByRole('button', { name: 'Continue' })
          await expect(submit).toBeDisabled() // required fields empty
          await expect(page.getByText('Fill in all fields marked')).toBeVisible() // says why
          await expect(page.locator('label', { hasText: 'Business name' })).toContainText('*')

          // Reserved address → free alternatives
          const address = page.getByRole('textbox', { name: 'Menu web address' })
          await address.fill('admin')
          await expect(page.getByText('Free addresses you can use:')).toBeVisible()
          await address.fill('')

          // Address follows the business name
          await page.getByRole('textbox', { name: 'Business name' }).fill('E2E Mahob Kitchen')
          await expect(address).toHaveValue('e2e-mahob-kitchen')
          await expect(page.getByText('Available')).toBeVisible()
          await page.getByRole('radio', { name: 'Maroon' }).click()
          // Business type "Other" → the owner types their own
          await page.getByRole('radio', { name: 'Other' }).click()
          await expect(submit).toBeDisabled()
          await page.getByRole('textbox', { name: 'Your business type' }).fill('Bakery')
          await expect(submit).toBeEnabled()
          await submit.click()
          await expect(page).toHaveURL(/\/onboarding\/outlet$/)
     })

     await test.step('step 3 · first outlet', async () => {
          await expect(page.getByRole('button', { name: 'Save outlet' })).toBeDisabled()
          await page.getByRole('textbox', { name: 'Outlet name' }).fill('BKK1')
          await page.getByRole('textbox', { name: 'Address' }).fill('#24, Street 240, Phnom Penh')
          await page.getByRole('button', { name: 'Sun' }).click() // closed on Sundays
          // Time dropdown: a late bar closes after midnight → "+1 day"
          await page.getByRole('button', { name: /Closes/ }).click()
          await page.getByRole('option', { name: '2:00 AM', exact: true }).click()
          await expect(page.getByText('Closes after midnight (next day)')).toBeVisible()
          if (process.env.E2E_SCREENSHOTS) {
               await page.getByRole('button', { name: /Opens/ }).click()
               await page.waitForTimeout(400) // let the list finish fading in
               await page.screenshot({ path: `${process.env.E2E_SCREENSHOTS}/time-select.png` })
               await page.keyboard.press('Escape')
          }
          await page.getByRole('button', { name: 'Save outlet' }).click()
          await expect(page).toHaveURL(/\/onboarding\/tables$/)
     })

     await test.step('step 4 · tables (no printing before the menu exists)', async () => {
          await expect(page.locator('figure svg')).toHaveCount(5) // QR previews (starts at the trial's 5)
          await expect(page.getByRole('button', { name: /Download all QR/ })).toHaveCount(0)
          // Free trial: max 5 tables
          await expect(page.getByText('Free trial: up to 5 tables')).toBeVisible()
          const count = page.getByRole('spinbutton', { name: 'Tables' })
          await count.fill('99')
          await expect(count).toHaveValue('5')
          await expect(page.getByRole('button', { name: 'More tables' })).toBeDisabled()
          await page.getByRole('button', { name: 'Fewer tables' }).click() // 5 → 4
          await page.getByRole('textbox', { name: 'Zone' }).fill('') // optional → "Indoor"
          await page.getByRole('button', { name: 'Finish & open dashboard' }).click()
     })

     await test.step('dashboard (app shell, guide p.8 / p.24)', async () => {
          await expect(page).toHaveURL(/\/dashboard$/)
          await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dashboard')
          await expect(page.getByText('Get E2E Mahob Kitchen live')).toBeVisible()
          await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
          await expect(page.getByText('Live tables')).toBeVisible()
          await expect(page.getByText('0 of 4 in use')).toBeVisible()
          if (process.env.E2E_SCREENSHOTS) {
               await page.screenshot({
                    path: `${process.env.E2E_SCREENSHOTS}/dashboard.png`,
                    fullPage: true,
               })
          }
          // Same TOKSCAN assistant as the landing page, with owner questions
          await page.getByText('Need help getting set up?').click()
          await page.getByRole('button', { name: 'When can I print QR codes?' }).click()
          await expect(page.getByText(/Once your menu is added/)).toBeVisible()
          await page.keyboard.press('Escape')
          // QR codes are locked until the menu exists — the print page sends you back
          const nav = page.getByRole('navigation', { name: 'Main navigation' })
          await expect(nav.locator('[aria-disabled="true"]', { hasText: 'QR Codes' })).toBeVisible()
          await page.goto('/onboarding/tables/print')
          await expect(page).toHaveURL(/\/dashboard$/)
     })

     await test.step('Tables inside the app layout (sidebar → Tables)', async () => {
          await page
               .getByRole('navigation', { name: 'Main navigation' })
               .getByRole('link', { name: 'Tables' })
               .click()
          await expect(page).toHaveURL(/\/tables$/)
          await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tables') // from the menu
          await expect(page.getByText(/^Operations ·/)).toBeVisible()
          await page.getByRole('button', { name: 'More tables' }).click() // 4 → 5
          await page.getByRole('button', { name: 'Save tables' }).click()
          await expect(page).toHaveURL(/\/tables$/)
          await expect(page.getByRole('spinbutton', { name: 'Tables' })).toHaveValue('5')
          await expect(page.getByRole('button', { name: 'More tables' })).toBeDisabled() // trial max
     })

     await test.step('Khmer', async () => {
          await context.addCookies([{ name: 'tok-locale', value: 'km', url: page.url() }])
          await page.reload()
          await expect(page.locator('html')).toHaveAttribute('lang', 'km')
     })

     await test.step('earlier steps stay editable', async () => {
          await context.addCookies([{ name: 'tok-locale', value: 'en', url: page.url() }])
          await page.goto('/onboarding/organization')
          await expect(page.getByRole('textbox', { name: 'Business name' })).toHaveValue(
               'E2E Mahob Kitchen',
          )
     })
})

test('signed-out visitors are sent to sign-up', async ({ browser }) => {
     const page = await (await browser.newContext()).newPage()
     for (const path of ['/onboarding', '/onboarding/tables', '/dashboard']) {
          await page.goto(path)
          await expect(page).toHaveURL(/\/signup$/)
     }
})
