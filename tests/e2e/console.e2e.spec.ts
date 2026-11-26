/**
 * Super-admin console (Payload admin, phase 1): only tok-scan staff get in; the home shows the
 * platform overview with the tok-scan logo.
 */
import { expect, test } from '@playwright/test'

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
     const login = await page.request.post('/api/users/login', {
          data: { email: testSuperAdmin.email, password: testSuperAdmin.password },
     })
     expect(login.ok()).toBe(true)

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
     const login = await page.request.post('/api/users/login', {
          data: { email: testOwner.email, password: testOwner.password },
     })
     expect(login.ok()).toBe(true)

     await page.goto('/admin')
     await expect(page.getByRole('heading', { name: 'Platform console' })).toHaveCount(0)
     await expect(page).toHaveURL(/\/admin\/(unauthorized|login)/)
})
