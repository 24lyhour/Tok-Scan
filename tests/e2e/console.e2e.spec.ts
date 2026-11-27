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

test('/admin opens the one console', async ({ page }) => {
     await apiLogin(page, testSuperAdmin)
     await page.goto('/admin')
     await expect(page).toHaveURL(/\/console\/organizations$/)
     await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible()
})

test('a restaurant owner cannot open /admin', async ({ page }) => {
     await apiLogin(page, testOwner)

     await page.goto('/admin')
     await expect(page.getByRole('heading', { name: 'Platform console' })).toHaveCount(0)
     // /admin → /console → owners are sent back to their own app
     await expect(page).not.toHaveURL(/\/(admin|console)/)
})

test('the login API refuses requests without the bot check', async ({ page }) => {
     const res = await page.request.post('/api/users/login', {
          data: { email: testSuperAdmin.email, password: testSuperAdmin.password },
     })
     expect(res.status()).toBe(400)
})

test('staff log in at their own address, /admin/login, and land in the console', async ({
     page,
}) => {
     await page.goto('/admin/login')
     // tok-scan's login in staff mode — the address stays /admin/login
     await expect(page).toHaveURL(/\/admin\/login$/)
     await expect(page.getByText('Platform console · staff only')).toBeVisible()
     await page.getByLabel(/^Email/).fill(testSuperAdmin.email)
     await page.getByLabel(/^Password/).fill(testSuperAdmin.password)
     await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue('', {
          timeout: 15000,
     })
     await page.getByRole('button', { name: 'Log in' }).click()
     // Lands in the one console
     await expect(page).toHaveURL(/\/console\/organizations$/)
     await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible()
})

test('a super-admin without a restaurant skips onboarding after the normal /login', async ({
     page,
}) => {
     await page.goto('/login')
     await page.getByLabel(/^Email/).fill(testSuperAdmin.email)
     await page.getByLabel(/^Password/).fill(testSuperAdmin.password)
     await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue('', {
          timeout: 15000,
     })
     await page.getByRole('button', { name: 'Log in' }).click()
     await expect(page).toHaveURL(/\/console\/organizations$/)

     // The owner app sends staff back to the console too (no "create your organization")
     await page.goto('/dashboard')
     await expect(page).toHaveURL(/\/console\/organizations$/)
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

test('console login is staff-only: no Google, no sign-up link', async ({ page }) => {
     await page.goto('/console')
     await expect(page).toHaveURL(/\/admin\/login$/)
     await expect(page.getByText('Platform console · staff only')).toBeVisible()
     await expect(page.getByText('Continue with Google')).toHaveCount(0)
     await expect(page.getByText('Start a free trial')).toHaveCount(0)
     // The owners' login keeps Google
     await page.goto('/login')
     await expect(page.getByText('Continue with Google')).toBeVisible()
})

test('log out asks first, then really signs out (back to /admin/login)', async ({ page }) => {
     await apiLogin(page, testSuperAdmin)
     await page.goto('/console/organizations')

     // Cancel keeps you signed in
     await page.getByRole('button', { name: 'Log out' }).click()
     const dialog = page.getByRole('alertdialog', { name: 'Log out?' })
     await expect(dialog).toBeVisible()
     await dialog.getByRole('button', { name: 'Cancel' }).click()
     await expect(dialog).toBeHidden()
     await expect(page).toHaveURL(/\/console\/organizations$/)

     // Confirm → cookie gone → staff login; the console is locked again
     await page.getByRole('button', { name: 'Log out' }).click()
     await page.getByRole('alertdialog').getByRole('button', { name: 'Log out' }).click()
     await expect(page).toHaveURL(/\/admin\/login$/)
     expect((await page.context().cookies()).some((c) => c.name === 'payload-token')).toBe(false)
     await page.goto('/console/organizations')
     await expect(page).toHaveURL(/\/admin\/login$/)
})
