import { redirect } from 'next/navigation'

import { getCurrentUser } from '../../auth/server/current-user'
import { authRoutes } from '../../auth/routes'
import { googleStartHref, isGoogleEnabled, isGoogleErrorCode } from '../../auth/google/config'
import { StepPage, stepMetadata } from '../components/step-page'
import { onboardingRoutes } from '../routes'
import { SignupForm } from './form'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

/** Onboarding step 1 of 4 — create the owner's account (guide p.23, first screen). */
export async function SignupPage({ searchParams }: { searchParams: SearchParams }) {
     const params = await searchParams
     const { user } = await getCurrentUser()
     // Already signed in → continue where onboarding left off
     if (user) redirect(onboardingRoutes.resume)

     const oauthError = isGoogleErrorCode(params.error) ? params.error : undefined
     const googleHref = isGoogleEnabled() ? googleStartHref(onboardingRoutes.signup) : null

     return (
          <StepPage step={1} section="signup" namespaces={['auth']}>
               <SignupForm
                    loginHref={authRoutes.login}
                    googleHref={googleHref}
                    oauthError={oauthError}
               />
          </StepPage>
     )
}

export const signupMetadata = stepMetadata('signup')
