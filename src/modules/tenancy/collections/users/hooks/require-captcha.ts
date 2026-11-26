import { APIError, type CollectionBeforeOperationHook } from 'payload'

import { TURNSTILE_COOKIE } from '@/shared/security/turnstile-config'
import { verifyTurnstile } from '@/shared/security/verify-turnstile'

/** Value of one cookie from a Cookie header */
export function readCookie(header: string | null | undefined, name: string): string | undefined {
     for (const part of header?.split(';') ?? []) {
          const [key, ...rest] = part.trim().split('=')
          if (key === name) return decodeURIComponent(rest.join('='))
     }
     return undefined
}

/**
 * Bot check for Payload's login API (REST /api/users/login and GraphQL) — used by the /admin login
 * form, and otherwise open to password-guessing scripts. The token comes in the `tok-captcha`
 * cookie set by the admin login widget. tok-scan's own /login checks Turnstile itself and logs in
 * through the Local API, so it isn't affected.
 */
export const requireCaptchaOnApiLogin: CollectionBeforeOperationHook = async ({
     operation,
     req,
     args,
}) => {
     if (operation !== 'login' || req.payloadAPI === 'local') return args
     const token = readCookie(req.headers.get('cookie'), TURNSTILE_COOKIE)
     if (!(await verifyTurnstile(token, 'admin-login'))) {
          throw new APIError(
               'Security check failed. Wait a moment for the check to finish, then try again.',
               400,
               null,
               true,
          )
     }
     return args
}
