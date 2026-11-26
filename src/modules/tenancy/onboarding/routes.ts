import type { OnboardingStep } from '../collections/organizations/constants'

/** Every onboarding URL — the only place they are written. */
export const onboardingRoutes = {
     signup: '/signup',
     /** Sends the owner to the step they are on (used after login and sign-up) */
     resume: '/onboarding',
     organization: '/onboarding/organization',
     outlet: '/onboarding/outlet',
     tables: '/onboarding/tables',
     printQr: '/onboarding/tables/print',
     dashboard: '/dashboard',
} as const

/** Page for each onboarding step (guide p.23: account → organization → outlet → tables). */
export const STEP_PATHS: Record<OnboardingStep, string> = {
     organization: onboardingRoutes.organization,
     outlet: onboardingRoutes.outlet,
     tables: onboardingRoutes.tables,
     done: onboardingRoutes.dashboard,
}
