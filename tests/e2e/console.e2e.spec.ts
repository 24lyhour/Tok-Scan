/**
 * Super-admin console (Payload admin, phase 1): only tok-scan staff get in; the home shows the
 * platform overview with the tok-scan logo.
 */
import { expect, test } from '@playwright/test'

import { apiLogin } from '../helpers/api-login'
import {
     createTestPendingOrg,
     ensureTestSuperAdmin,
     resetTestOwner,
     testOwner,
     testPendingOrg,
     testSuperAdmin,
} from '../helpers/test-owner'

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
     await ensureTestSuperAdmin()
     await resetTestOwner()
     await createTestPendingOrg()
})

test('a super-admin sees the data admin with a link to the console', async ({ page }) => {
     await apiLogin(page, testSuperAdmin)

     await page.goto('/admin')
     await expect(page.getByRole('heading', { name: 'Platform console' })).toBeVisible()
     // The data admin points to the real console
     await expect(page.getByRole('link', { name: /Open the console/ })).toHaveAttribute(
          'href',
          '/console/organizations',
     )
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

test('console: a super-admin approves, then suspends, a restaurant (guide p.27)', async ({
     page,
}) => {
     await apiLogin(page, testSuperAdmin)
     await page.goto('/console')
     await expect(page).toHaveURL(/\/console\/organizations$/)
     await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible()
     await expect(page.getByText('Platform console · staff only')).toBeVisible()

     // Approvals queue lists it; open its panel and approve
     await page.getByRole('link', { name: /Approvals/ }).click()
     await expect(page).toHaveURL(/\/console\/approvals/)
     await page.getByRole('link', { name: new RegExp(`^${testPendingOrg.name}`) }).click()
     const panel = page.locator('aside').filter({ hasText: 'Verification' })
     await expect(panel.getByText('Pending approval')).toBeVisible()
     await panel.getByRole('button', { name: 'Approve' }).click()
     await expect(panel.getByText('Active', { exact: true })).toBeVisible()
     await expect(panel.getByText('Last status change')).toBeVisible()

     // Suspend asks first
     await panel.getByRole('button', { name: 'Suspend…' }).click()
     await expect(panel.getByText(`Suspend ${testPendingOrg.name}?`)).toBeVisible()
     await panel.getByRole('button', { name: 'Yes, suspend' }).click()
     await expect(panel.getByText('Suspended', { exact: true })).toBeVisible()
     await expect(panel.getByRole('button', { name: 'Reactivate' })).toBeVisible()
})

test('console: restaurant owners are kept out', async ({ page }) => {
     await apiLogin(page, testOwner)
     await page.goto('/console/organizations')
     await expect(page).not.toHaveURL(/\/console/)
})
