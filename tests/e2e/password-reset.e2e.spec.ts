/** Forgot password → branded reset page → new password → signed in (guide: tok-scan look end to end). */
import { expect, test } from '@playwright/test'

import { resetTokenForTestUser } from '../helpers/reset-user'

test('"Forgot password?" opens tok-scan’s page and never reveals who has an account', async ({
     page,
}) => {
     await page.goto('/login')
     await page.getByRole('link', { name: 'Forgot password?' }).click()
     await expect(page).toHaveURL(/\/forgot-password$/)
     await expect(page.getByRole('heading', { name: 'Forgot your password?' })).toBeVisible()

     // An email with no account gets exactly the same answer
     await page.getByLabel('Email').fill('nobody-here@test.tok-scan.local')
     // Wait for the bot check to hand the form its token
     await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue('', {
          timeout: 15000,
     })
     await page.getByRole('button', { name: 'Send reset link' }).click()
     await expect(page).toHaveURL(/\/forgot-password\?sent=1$/)
     await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()
})

test('the email link sets a new password and signs you in; the link works once', async ({
     page,
}) => {
     const token = await resetTokenForTestUser()
     const link = `/reset-password?token=${encodeURIComponent(token)}`

     await page.goto(link)
     await expect(page.getByRole('heading', { name: 'Choose a new password' })).toBeVisible()
     await page.getByLabel(/^New password/).fill('e2e-new-password-1')
     await page.getByLabel(/^Repeat new password/).fill('e2e-new-password-1')
     await page.getByRole('button', { name: 'Save and log in' }).click()
     // Signed in → owners without a restaurant continue onboarding
     await expect(page).toHaveURL(/\/onboarding/)

     // Same link again → refused, with a way to ask for a new one
     await page.context().clearCookies()
     await page.goto(link)
     await page.getByLabel(/^New password/).fill('another-password-1')
     await page.getByLabel(/^Repeat new password/).fill('another-password-1')
     await page.getByRole('button', { name: 'Save and log in' }).click()
     await expect(page.getByText('This reset link is invalid or has expired')).toBeVisible()
     await expect(page.getByRole('link', { name: 'Send me a new link' })).toBeVisible()
})

test('/reset-password without a link explains what to do', async ({ page }) => {
     await page.goto('/reset-password')
     await expect(page.getByRole('heading', { name: 'This link doesn’t work' })).toBeVisible()
     await expect(page.getByRole('link', { name: 'Send me a new link' })).toHaveAttribute(
          'href',
          '/forgot-password',
     )
})
