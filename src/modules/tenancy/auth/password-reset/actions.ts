'use server'

import { redirect } from 'next/navigation'

import { getLocale } from '@/i18n/server'
import { ADMINS_SLUG } from '@/modules/core/payload'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'
import { formValues } from '@/shared/lib/validation'
import { TURNSTILE_FIELD } from '@/shared/security/turnstile-config'
import { verifyTurnstile } from '@/shared/security/verify-turnstile'

import { getPublicOrigin } from '../../onboarding/server/context'
import { type AuthState, validate } from '../errors'
import { authRoutes } from '../routes'
import { getCurrentUser } from '../server/current-user'
import { setAuthCookie } from '../server/session'
import type { ResetEmailContext } from './email'
import { type ForgotField, forgotSchema, type ResetField, resetSchema } from './schema'

export type ForgotState = AuthState<ForgotField>
export type ResetState = AuthState<ResetField>

/**
 * "Forgot password?" — email a single-use reset link (valid 1 hour) through Payload, which also
 * rate-limits it (one email per 15 s per account). The answer is the same whether the email
 * exists or not, so the form can't be used to find out who has an account.
 */
export async function requestResetAction(
     _prev: ForgotState,
     formData: FormData,
): Promise<ForgotState> {
     const result = validate(forgotSchema, formValues(formData))
     if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }

     if (!(await verifyTurnstile(formData.get(TURNSTILE_FIELD), 'reset'))) {
          return { status: 'error', formError: 'captcha' }
     }

     // tok-scan staff reset their password in their own table
     const staff = formData.get('staff') === '1'
     const { payload } = await getCurrentUser()
     const context: ResetEmailContext = {
          resetOrigin: await getPublicOrigin(),
          resetLocale: await getLocale(),
     }
     try {
          await payload.forgotPassword({
               collection: staff ? ADMINS_SLUG : 'users',
               data: { email: result.data.email },
               context,
          })
     } catch (error) {
          // Never shown to the visitor (it could reveal that the email exists)
          payload.logger.error({ err: error, msg: 'Password reset email failed' })
     }

     redirect(`${authRoutes.forgotPassword}?sent=1${staff ? '&staff=1' : ''}`)
}

/** The page the email link opens: save the new password, then sign the person in. */
export async function resetPasswordAction(
     _prev: ResetState,
     formData: FormData,
): Promise<ResetState> {
     const result = validate(resetSchema, formValues(formData))
     if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }

     const staff = formData.get('staff') === '1'
     const { payload } = await getCurrentUser()
     try {
          const { token } = await payload.resetPassword({
               collection: staff ? ADMINS_SLUG : 'users',
               data: { token: result.data.token, password: result.data.password },
               overrideAccess: true,
          })
          if (token) await setAuthCookie(payload, token)
     } catch {
          // Unknown, used or expired token
          return { status: 'error', formError: 'tokenInvalid' }
     }

     redirect(staff ? CONSOLE_ROUTES.home : authRoutes.afterLogin)
}
