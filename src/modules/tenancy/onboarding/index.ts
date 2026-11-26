/**
 * tenancy/onboarding — self-serve restaurant sign-up (guide p.22–23).
 *
 *   /signup                    step 1  signup/        account
 *   /onboarding/organization   step 2  organization/  business, web address, logo, colour
 *   /onboarding/outlet         step 3  outlet/        first branch, currency, taxes, hours
 *   /onboarding/tables         step 4  tables/        tables + QR codes (+ /print sheet)
 *   (dashboard)                        go-live/       "Get <restaurant> live" checklist — shown by @/modules/workspace
 *   /onboarding                        resume.ts      → the step the owner is on
 *
 * Every step folder has the same files: page.tsx · form.tsx · schema.ts (Zod) · actions.ts.
 * Shared: routes.ts (URLs) · errors.ts (error codes) · server/context.ts · components/.
 * Text: `onboarding` namespace (content/en·km·zh.ts).
 */
export { canPrintQr, goLiveRows } from './go-live/checklist'
export { ChecklistCard } from './go-live/checklist-card'
export { organizationMetadata, OrganizationStepPage } from './organization/page'
export { outletMetadata, OutletStepPage } from './outlet/page'
export { ResumeOnboarding } from './resume'
export { onboardingRoutes } from './routes'
export { getOnboardingContext } from './server/context'
export { SignupPage, signupMetadata } from './signup/page'
export { printQrMetadata, PrintQrPage } from './tables/print-page'
export { tablesMetadata, TablesStepPage } from './tables/page'
export { TablesSettingsPage } from './tables/settings-page'
export type { OnboardingErrorCode } from './errors'
