'use server'

import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthenticationError, getPayload, LockedAuth } from 'payload'

import { type LoginErrorCode, type LoginField, safeNextPath, validateLogin } from './validation'

export type LoginState = {
     status: 'idle' | 'error'
     fieldErrors?: Partial<Record<LoginField, LoginErrorCode>>
     formError?: LoginErrorCode
}

// Not exported: a 'use server' file may only export async functions.
// TODO(staff app): send owners to their dashboard once it exists.
const DEFAULT_AFTER_LOGIN = '/onboarding/organization'

/** Log a staff member / owner in with email + password and set Payload's auth cookie. */
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
     const result = validateLogin({
          email: String(formData.get('email') ?? ''),
          password: String(formData.get('password') ?? ''),
     })
     if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }

     const payload = await getPayload({ config })
     try {
          const { token, exp } = await payload.login({ collection: 'users', data: result.data })
          if (!token) return { status: 'error', formError: 'generic' }

          ;(await cookies()).set(`${payload.config.cookiePrefix}-token`, token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite: 'lax',
               path: '/',
               ...(exp ? { expires: new Date(exp * 1000) } : {}),
          })
     } catch (error) {
          // Same message for "no such user" and "wrong password" — don't reveal which emails exist.
          if (error instanceof LockedAuth) return { status: 'error', formError: 'locked' }
          if (error instanceof AuthenticationError) {
               return { status: 'error', formError: 'invalidCredentials' }
          }
          payload.logger.error({ err: error, msg: 'Login failed' })
          return { status: 'error', formError: 'generic' }
     }

     redirect(safeNextPath(formData.get('next'), DEFAULT_AFTER_LOGIN))
}
