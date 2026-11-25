'use server'

import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { verifyTurnstile } from '@/shared/security/verify-turnstile'
import { TURNSTILE_FIELD } from '@/shared/security/turnstile-config'

import { type SignupErrorCode, type SignupField, validateSignup } from './validation'

export type SignupState = {
     status: 'idle' | 'error'
     fieldErrors?: Partial<Record<SignupField, SignupErrorCode>>
     formError?: SignupErrorCode
}

// Not exported: a 'use server' file may only export async functions.
const NEXT_STEP_AFTER_SIGNUP = '/onboarding/organization'

/**
 * Onboarding step 1 — create the owner's account and sign them in.
 *
 * Users have no public `create` access; this action is the only self-sign-up path, so it
 * writes with overrideAccess but passes ONLY whitelisted fields (never roles/tenants).
 * TODO(module 14): rate-limit by IP + email, and add the 6-digit email/Telegram verification step.
 */
export async function signupAction(_prev: SignupState, formData: FormData): Promise<SignupState> {
     const result = validateSignup({
          name: String(formData.get('name') ?? ''),
          email: String(formData.get('email') ?? ''),
          phone: String(formData.get('phone') ?? ''),
          password: String(formData.get('password') ?? ''),
          terms: formData.get('terms') === 'on',
     })
     if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }

     // Bot check before creating anything
     if (!(await verifyTurnstile(formData.get(TURNSTILE_FIELD), 'signup'))) {
          return { status: 'error', formError: 'captcha' }
     }

     const { name, email, phone, password } = result.data
     const payload = await getPayload({ config })

     try {
          const existing = await payload.find({
               collection: 'users',
               where: { email: { equals: email } },
               limit: 1,
               depth: 0,
               overrideAccess: true,
          })
          if (existing.totalDocs > 0) {
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
               ;(await cookies()).set(`${payload.config.cookiePrefix}-token`, token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    ...(exp ? { expires: new Date(exp * 1000) } : {}),
               })
          }
     } catch (error) {
          // Unique-email race between the check above and create()
          const message = error instanceof Error ? error.message : ''
          if (/email/i.test(message) && /(unique|already|registered)/i.test(message)) {
               return { status: 'error', fieldErrors: { email: 'emailTaken' } }
          }
          payload.logger.error({ err: error, msg: 'Sign-up failed' })
          return { status: 'error', formError: 'generic' }
     }

     redirect(NEXT_STEP_AFTER_SIGNUP)
}
