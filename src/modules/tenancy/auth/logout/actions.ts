'use server'

import { redirect } from 'next/navigation'

import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

import { authRoutes } from '../routes'
import { getCurrentUser } from '../server/current-user'
import { clearAuthCookie, endSession } from '../server/session'

/** Only one of our login pages: owners' /login or the staff login — never another site. */
const LOGIN_PAGES: readonly string[] = [authRoutes.login, CONSOLE_ROUTES.login]
function loginTarget(raw: FormDataEntryValue | null): string {
     return typeof raw === 'string' && LOGIN_PAGES.includes(raw) ? raw : authRoutes.login
}

/**
 * Log out on the server: end this session, then ALWAYS delete the cookie, so nothing (an expired
 * token, a refused request) can leave the browser signed in.
 */
export async function logoutAction(formData: FormData): Promise<never> {
     const { payload, user } = await getCurrentUser()
     const sid = (user as { _sid?: string } | null)?._sid
     if (user && sid) {
          await endSession(payload, user.id, sid).catch((error: unknown) =>
               payload.logger.error({ err: error, msg: 'Logout: could not end the session' }),
          )
     }
     await clearAuthCookie(payload)
     redirect(loginTarget(formData.get('next')))
}
