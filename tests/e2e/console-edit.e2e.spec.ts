/**
 * Console · Edit organization (support): staff fix a restaurant's details and its owner's email;
 * owners can't extend their own trial.
 */
import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'

import config from '../../src/payload.config'

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

let orgId = 0

test.beforeAll(async () => {
     await ensureTestSuperAdmin()
     await resetTestOwner()
     await createTestPendingOrg()
})

test('a super-admin edits a restaurant and its owner from the console', async ({ page }) => {
     await apiLogin(page, testSuperAdmin)
     await page.goto('/console/organizations')
     await page.getByRole('link', { name: new RegExp(`^${testPendingOrg.name}`) }).click()
     await page.getByRole('link', { name: `Edit · ${testPendingOrg.name}` }).click()
     await expect(page.getByRole('heading', { name: 'Edit organization' })).toBeVisible()
     orgId = Number(page.url().match(/organizations\/(\d+)\/edit/)?.[1])

     // An email another account uses is refused, in staff wording
     const email = page.getByLabel(/^Login email/)
     await email.fill(testSuperAdmin.email)
     await page.getByRole('button', { name: 'Save changes' }).click()
     await expect(page.getByText('Another account already uses this email.')).toBeVisible()

     // Fix it, rename the restaurant and extend the trial
     await email.fill(testOwner.email)
     await page.getByLabel(/^Business name/).fill('E2E Edited Cafe')
     await page.getByLabel(/^Trial ends/).fill('2030-01-31')
     await page.getByRole('button', { name: 'Save changes' }).click()

     // Back on the restaurant's panel with the new details
     await expect(page).toHaveURL(new RegExp(`/console/organizations\\?org=${orgId}$`))
     const panel = page.locator('aside').filter({ hasText: 'Verification' })
     await expect(panel.getByText('E2E Edited Cafe')).toBeVisible()
     await expect(panel.getByText(/2030/)).toBeVisible()
})

test('owners cannot extend their own trial through the API', async ({ page }) => {
     expect(orgId).toBeGreaterThan(0)
     const payload = await getPayload({ config: await config })
     // Make the test owner a real owner-member, so the API lets them edit the organization at all
     const { docs } = await payload.find({
          collection: 'users',
          where: { email: { equals: testOwner.email } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
     })
     await payload.update({
          collection: 'users',
          id: docs[0]!.id,
          data: { tenants: [{ tenant: orgId, orgRole: 'owner' }] },
          overrideAccess: true,
     })

     await apiLogin(page, testOwner)
     const res = await page.request.patch(`/api/organizations/${orgId}`, {
          data: { name: 'Owner Renamed Cafe', trialEndsAt: '2099-12-31T00:00:00.000Z' },
     })
     expect(res.ok()).toBe(true)

     const org = await payload.findByID({ collection: 'organizations', id: orgId, depth: 0 })
     // Their own name change is fine; the trial date is staff-only
     expect(org.name).toBe('Owner Renamed Cafe')
     expect(org.trialEndsAt).toMatch(/^2030-01-31/)
})
