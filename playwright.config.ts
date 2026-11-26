import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

/** End-to-end tests (tests/e2e). Uses a running dev server if there is one, otherwise starts it. */
export default defineConfig({
     testDir: './tests/e2e',
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 1 : 0,
     workers: 1,
     timeout: 120_000,
     expect: { timeout: 20_000 },
     reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
     use: {
          baseURL,
          trace: 'on-first-retry',
          // Optional: point at an already-installed Chromium (PLAYWRIGHT_CHROMIUM_PATH)
          launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined },
     },
     projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
     webServer: {
          command: 'yarn dev',
          url: baseURL,
          reuseExistingServer: true,
          timeout: 240_000,
     },
})
