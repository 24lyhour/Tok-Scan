/**
 * Restaurant onboarding, end to end (guide p.22–23):
 * step 2 organization → step 3 outlet → step 4 tables → print sheet → dashboard (+ Khmer).
 */
import { expect, test } from '@playwright/test'

import { resetTestOwner, testOwner } from '../helpers/test-owner'

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
     await resetTestOwner()
})

test('a new owner sets up a restaurant', async ({ page, context }) => {
     // Sign in through the API (the login form has its own captcha-protected flow)
     const login = await page.request.post('/api/users/login', {
          data: { email: testOwner.email, password: testOwner.password },
     })
     expect(login.ok()).toBe(true)

     await page.goto('/onboarding')
     await expect(page).toHaveURL(/\/onboarding\/organization$/)

     await test.step('step 2 · organization', async () => {
          const submit = page.getByRole('button', { name: 'Continue' })
          await expect(submit).toBeDisabled() // required fields empty
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
          await page.getByRole('button', { name: 'Save outlet' }).click()
          await expect(page).toHaveURL(/\/onboarding\/tables$/)
     })

     await test.step('step 4 · tables + print sheet', async () => {
          await expect(page.locator('figure svg')).toHaveCount(6) // QR previews
          await page.getByRole('button', { name: 'Fewer tables' }).click() // 16 → 15
          await page.getByRole('button', { name: /Download all QR/ }).click()
          await expect(page).toHaveURL(/\/onboarding\/tables\/print$/)
          await expect(page.locator('article')).toHaveCount(15)
     })

     await test.step('finish → dashboard', async () => {
          await page.goto('/onboarding/tables')
          await page.getByRole('button', { name: 'Finish & open dashboard' }).click()
          await expect(page).toHaveURL(/\/dashboard$/)
          await expect(page.getByRole('heading', { level: 1 })).toHaveText(
               'Get E2E Mahob Kitchen live',
          )
          await expect(page.getByText('BKK1 · 15 tables')).toBeVisible()
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
