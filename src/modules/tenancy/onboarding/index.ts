/**
 * tenancy/onboarding — self-serve restaurant sign-up (guide p.22–23).
 * Step 1 /signup → step 2 /onboarding/organization → step 3 /onboarding/outlet → step 4 /onboarding/tables.
 * Text: `onboarding` namespace of the global i18n catalog (src/i18n).
 */
export { organizationMetadata, OrganizationStepPage } from './organization-page'
export { SignupPage, signupMetadata } from './signup-page'
export type { OnboardingContent } from './content'
