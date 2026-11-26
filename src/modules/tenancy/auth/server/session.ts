import { randomUUID } from 'node:crypto'

import { cookies } from 'next/headers'
import { getFieldsToSign, jwtSign, type Payload } from 'payload'

/** Name of Payload's auth cookie (default prefix "payload"). */
export function authCookieName(payload: Payload) {
     return `${payload.config.cookiePrefix}-token`
}

/** Cookie options shared by every way of signing in. */
export function authCookieOptions(exp?: number) {
     return {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as const,
          path: '/',
          ...(exp ? { expires: new Date(exp * 1000) } : {}),
     }
}

/** Set Payload's auth cookie from a server action or route handler. */
export async function setAuthCookie(payload: Payload, token: string, exp?: number) {
     ;(await cookies()).set(authCookieName(payload), token, authCookieOptions(exp))
}

type SessionEntry = { id: string; createdAt: Date | string; expiresAt: Date | string }

/**
 * Start a normal Payload session for a user WITHOUT a password — used by "Continue with Google".
 *
 * Mirrors payload/dist/auth/operations/login.js (3.94.2): register a session id on the user
 * (when `useSessions` is on), then sign the same JWT fields with the same secret and expiry.
 * The result is indistinguishable from a password login, so /admin, payload.auth() and session
 * expiry all work. Re-check this against Payload's login operation when upgrading Payload.
 */
export async function issueSession(
     payload: Payload,
     userId: number | string,
): Promise<{ token: string; exp: number }> {
     const collectionConfig = payload.collections.users.config
     const { tokenExpiration, useSessions } = collectionConfig.auth

     // Full row, including hidden fields such as `sessions`
     const user = (await payload.db.findOne({
          collection: 'users',
          where: { id: { equals: userId } },
     })) as
          | (Record<string, unknown> & {
                 id: number | string
                 email: string
                 sessions?: SessionEntry[]
            })
          | null
     if (!user) throw new Error(`issueSession: user ${userId} not found`)

     let sid: string | undefined
     if (useSessions) {
          sid = randomUUID()
          const now = new Date()
          const expiresAt = new Date(now.getTime() + tokenExpiration * 1000)
          const active = (user.sessions ?? []).filter((s) => new Date(s.expiresAt) > now)
          user.sessions = [...active, { id: sid, createdAt: now, expiresAt }]
          // Same as Payload: adding a session must not bump updatedAt
          user.updatedAt = null
          await payload.db.updateOne({
               id: user.id,
               collection: 'users',
               data: user,
               returning: false,
          })
     }

     const fieldsToSign = getFieldsToSign({
          collectionConfig,
          email: user.email,
          sid,
          user: { ...user, collection: 'users' } as Parameters<typeof getFieldsToSign>[0]['user'],
     })
     return jwtSign({ fieldsToSign, secret: payload.secret, tokenExpiration })
}
