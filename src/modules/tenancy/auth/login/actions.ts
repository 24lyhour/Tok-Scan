'use server'

import { redirect } from 'next/navigation'
import { AuthenticationError, LockedAuth } from 'payload'

import { ADMINS_SLUG } from '@/modules/core/payload'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'
import { formValues } from '@/shared/lib/validation'
import { verifyTurnstile } from '@/shared/security/verify-turnstile'
import { TURNSTILE_FIELD } from '@/shared/security/turnstile-config'

import { type AuthState, validate } from '../errors'
import { authRoutes, isStaffLogin, safeNextPath } from '../routes'
import { getCurrentUser } from '../server/current-user'
import { setAuthCookie } from '../server/session'
import { type LoginField, loginSchema } from './schema'

export type LoginState = AuthState<LoginField>

/** Log in with email + password (owners: `users`; console staff: `admins`) and set the auth cookie. */
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
     const result = validate(loginSchema, formValues(formData))
     if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }

     // Bot check first, so bots can't use this form to guess passwords
     if (!(await verifyTurnstile(formData.get(TURNSTILE_FIELD), 'login'))) {
          return { status: 'error', formError: 'captcha' }
     }

     // Staff (console) and owners have separate tables: each login only checks its own
     const next = formData.get('next')
     const staff = isStaffLogin(next)
     const { payload } = await getCurrentUser()
     try {
          const { token, exp } = await payload.login({
               collection: staff ? ADMINS_SLUG : 'users',
               data: result.data,
          })
          if (!token) return { status: 'error', formError: 'generic' }

          await setAuthCookie(payload, token, exp)
     } catch (error) {
          // Same message for "no such user" and "wrong password" — don't reveal which emails exist.
          if (error instanceof LockedAuth) return { status: 'error', formError: 'locked' }
          if (error instanceof AuthenticationError) {
               return { status: 'error', formError: 'invalidCredentials' }
          }
          payload.logger.error({ err: error, msg: 'Login failed' })
          return { status: 'error', formError: 'generic' }
     }

     redirect(safeNextPath(next, staff ? CONSOLE_ROUTES.home : authRoutes.afterLogin))
}
