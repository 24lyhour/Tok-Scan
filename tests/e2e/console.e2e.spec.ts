/**
 * Super-admin console (Payload admin, phase 1): only tok-scan staff get in; the home shows the
 * platform overview with the tok-scan logo.
 */
import { expect, test } from '@playwright/test'

import { apiLogin } from '../helpers/api-login'
import {
     ensureTestSuperAdmin,
     resetTestOwner,
     testOwner,
     testSuperAdmin,
} from '../helpers/test-owner'

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
     await ensureTestSuperAdmin()
     await resetTestOwner()
})

test('a super-admin sees the platform console', async ({ page }) => {
     await apiLogin(page, testSuperAdmin)

     await page.goto('/admin')
     await expect(page.getByRole('heading', { name: 'Platform console' })).toBeVisible()
     await expect(page.getByText('Waiting for approval', { exact: true })).toBeVisible()
     await expect(page.getByText('Newest sign-ups', { exact: true })).toBeVisible()
     // Menu groups
     await expect(page.getByText('Restaurant data').first()).toBeVisible()
     if (process.env.E2E_SCREENSHOTS) {
          await page.screenshot({
               path: `${process.env.E2E_SCREENSHOTS}/console.png`,
               fullPage: true,
          })
     }
})

test('a restaurant owner cannot open /admin', async ({ page }) => {
     await apiLogin(page, testOwner)

     await page.goto('/admin')
     await expect(page.getByRole('heading', { name: 'Platform console' })).toHaveCount(0)
     await expect(page).toHaveURL(/\/admin\/(unauthorized|login)/)
})

test('the login API refuses requests without the bot check', async ({ page }) => {
     const res = await page.request.post('/api/users/login', {
          data: { email: testSuperAdmin.email, password: testSuperAdmin.password },
     })
     expect(res.status()).toBe(400)
})

test('a super-admin logs in on the branded /admin/login', async ({ page }) => {
     await page.goto('/admin/login')
     await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
     await expect(page.getByText('Platform console · staff only')).toBeVisible()
     // Invisible Turnstile hands its token over in a cookie before the form is sent
     await expect
          .poll(async () => (await page.context().cookies()).some((c) => c.name === 'tok-captcha'))
          .toBe(true)
     await page.getByLabel('Email').fill(testSuperAdmin.email)
     await page.getByLabel('Password').fill(testSuperAdmin.password)
     await page.getByRole('button', { name: 'Login' }).click()
     await expect(page.getByRole('heading', { name: 'Platform console' })).toBeVisible()
})
