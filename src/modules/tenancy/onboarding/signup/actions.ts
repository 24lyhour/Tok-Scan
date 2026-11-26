'use server'

import { redirect } from 'next/navigation'

import { setAuthCookie } from '../../auth/server/session'
import { formValues } from '@/shared/lib/validation'
import { verifyTurnstile } from '@/shared/security/verify-turnstile'
import { TURNSTILE_FIELD } from '@/shared/security/turnstile-config'

import { exists, isUniqueError } from '@/shared/lib/payload'
import { getCurrentUser } from '../../auth/server/current-user'
import { type StepState, validate } from '../errors'
import { onboardingRoutes } from '../routes'
import { signupSchema, type SignupField } from './schema'

export type SignupState = StepState<SignupField>

/**
 * Onboarding step 1 — create the owner's account and sign them in.
 *
 * Users have no public `create` access; this action is the only self-sign-up path, so it
 * writes with overrideAccess but passes ONLY whitelisted fields (never roles/tenants).
 * TODO(module 14): rate-limit by IP + email, and add the 6-digit email/Telegram verification step.
 */
export async function signupAction(_prev: SignupState, formData: FormData): Promise<SignupState> {
     const result = validate(signupSchema, formValues(formData))
     if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }

     // Bot check before creating anything
     if (!(await verifyTurnstile(formData.get(TURNSTILE_FIELD), 'signup'))) {
          return { status: 'error', formError: 'captcha' }
     }

     const { name, email, phone, password } = result.data
     const { payload } = await getCurrentUser()

     try {
          if (await exists(payload, 'users', { email: { equals: email } })) {
               return { status: 'error', fieldErrors: { email: 'emailTaken' } }
          }

          await payload.create({
               collection: 'users',
               data: { name, email, phone, password, acceptedTermsAt: new Date().toISOString() },
               overrideAccess: true,
          })

          const { token, exp } = await payload.login({
               collection: 'users',
               data: { email, password },
          })

          if (token) {
               await setAuthCookie(payload, token, exp)
          }
     } catch (error) {
          // Unique-email race between the check above and create()
          if (isUniqueError(error, 'email')) {
               return { status: 'error', fieldErrors: { email: 'emailTaken' } }
          }
          payload.logger.error({ err: error, msg: 'Sign-up failed' })
          return { status: 'error', formError: 'generic' }
     }

     redirect(onboardingRoutes.resume)
}
