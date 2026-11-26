import { timingSafeEqual } from 'node:crypto'

import config from '@payload-config'
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload, type Payload } from 'payload'

import { authRoutes, safeNextPath } from '../routes'
import { authCookieName, authCookieOptions, issueSession } from '../server/session'
import {
     GOOGLE_CALLBACK_PATH,
     GOOGLE_FLOW_COOKIE,
     GOOGLE_FLOW_MAX_AGE,
     GOOGLE_START_PATH,
     type GoogleErrorCode,
     getGoogleCredentials,
} from './config'
import {
     buildAuthorizationUrl,
     exchangeCodeForProfile,
     type GoogleProfile,
     randomToken,
} from './oauth'

type Flow = {
     state: string
     verifier: string
     nonce: string
     from: '/login' | '/signup'
     next?: string
}

const flowCookie = {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax' as const,
     // Only sent to /auth/google/* — not to the rest of the site
     path: GOOGLE_START_PATH,
}

/**
 * The one public address (CANONICAL_HOST, e.g. tok-scan.store). Google's redirect URI and the flow
 * cookie must live on the SAME host — if sign-in starts on tok-scans.vercel.app but Google returns to
 * tok-scan.store, the browser won't send the cookie and sign-in fails. Falls back to the request's
 * own origin (localhost, previews).
 */
function publicOrigin(url: URL): string {
     const host = process.env.CANONICAL_HOST?.trim().toLowerCase()
     return host ? `https://${host}` : url.origin
}

/** Visitor came in on another address → same path on the canonical one, or null if already there. */
function toCanonical(url: URL): URL | null {
     const origin = publicOrigin(url)
     return origin === url.origin ? null : new URL(`${url.pathname}${url.search}`, origin)
}

/**
 * Logged with console.* on purpose: Payload's logger writes asynchronously and serverless functions
 * can be frozen before it flushes, which hid these reasons in production. Never logs secrets/codes.
 */
function logGoogle(level: 'warn' | 'error', reason: string, detail?: unknown) {
     const extra = detail instanceof Error ? detail.message : detail
     console[level](`[google-signin] ${reason}`, extra ?? '')
}

const sameString = (a: string, b: string) => {
     const x = Buffer.from(a)
     const y = Buffer.from(b)
     return x.length === y.length && timingSafeEqual(x, y)
}

/**
 * GET /auth/google?from=/login&next=/somewhere — send the visitor to Google's account chooser.
 */
export async function startGoogleSignIn(request: NextRequest) {
     const url = new URL(request.url)
     // Start on the canonical address so the flow cookie lands where Google will send them back
     const canonical = toCanonical(url)
     if (canonical) return NextResponse.redirect(canonical)
     const from =
          url.searchParams.get('from') === authRoutes.signup ? authRoutes.signup : authRoutes.login
     const credentials = getGoogleCredentials()
     if (!credentials) {
          logGoogle('warn', 'not configured: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing')
          return NextResponse.redirect(new URL(`${from}?error=unavailable`, url.origin))
     }

     const nextParam = url.searchParams.get('next')
     const flow: Flow = {
          state: randomToken(),
          verifier: randomToken(48),
          nonce: randomToken(),
          from,
          ...(nextParam ? { next: safeNextPath(nextParam, authRoutes.afterLogin) } : {}),
     }

     const response = NextResponse.redirect(
          buildAuthorizationUrl({
               clientId: credentials.clientId,
               redirectUri: `${publicOrigin(url)}${GOOGLE_CALLBACK_PATH}`,
               state: flow.state,
               codeVerifier: flow.verifier,
               nonce: flow.nonce,
          }),
     )
     response.cookies.set(GOOGLE_FLOW_COOKIE, JSON.stringify(flow), {
          ...flowCookie,
          maxAge: GOOGLE_FLOW_MAX_AGE,
     })
     return response
}

/**
 * GET /auth/google/callback — Google sends the visitor back here with a one-time code.
 * Verifies state, exchanges the code, links or creates the user, starts a Payload session.
 */
export async function finishGoogleSignIn(request: NextRequest) {
     const url = new URL(request.url)
     // Wrong address (e.g. vercel.app): hand the same code/state to the canonical callback,
     // where the flow cookie lives
     const canonical = toCanonical(url)
     if (canonical) return NextResponse.redirect(canonical)
     let flow: Flow | null = null
     try {
          flow = JSON.parse(request.cookies.get(GOOGLE_FLOW_COOKIE)?.value ?? 'null') as Flow | null
     } catch {
          flow = null
     }
     const from = flow?.from ?? authRoutes.login

     const fail = (code: GoogleErrorCode) => {
          const response = NextResponse.redirect(new URL(`${from}?error=${code}`, url.origin))
          response.cookies.set(GOOGLE_FLOW_COOKIE, '', { ...flowCookie, maxAge: 0 })
          return response
     }

     // The person pressed "Cancel" (or Google refused, e.g. not a test user yet)
     const providerError = url.searchParams.get('error')
     if (providerError) {
          logGoogle('warn', `Google returned error=${providerError}`)
          return fail('cancelled')
     }

     const credentials = getGoogleCredentials()
     if (!credentials) {
          logGoogle('warn', 'not configured: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing')
          return fail('unavailable')
     }

     const code = url.searchParams.get('code')
     const state = url.searchParams.get('state')
     // Missing/expired flow cookie or a forged `state` → reject (CSRF protection)
     if (!flow) {
          logGoogle(
               'warn',
               'flow cookie missing or expired (started on another address, or >10 min)',
          )
          return fail('failed')
     }
     if (!code || !state || !sameString(state, flow.state)) {
          logGoogle('warn', 'state mismatch or missing code — possible replay/CSRF, rejected')
          return fail('failed')
     }

     const payload = await getPayload({ config })
     try {
          const profile = await exchangeCodeForProfile({
               code,
               codeVerifier: flow.verifier,
               clientId: credentials.clientId,
               clientSecret: credentials.clientSecret,
               redirectUri: `${publicOrigin(url)}${GOOGLE_CALLBACK_PATH}`,
               nonce: flow.nonce,
          })
          if (!profile.emailVerified) {
               logGoogle('warn', 'Google email not verified — rejected')
               return fail('unverified')
          }

          const userId = await findOrCreateGoogleUser(payload, profile)
          if (userId === null) {
               logGoogle('warn', 'email already linked to a different Google account — rejected')
               return fail('failed')
          }

          const { token, exp } = await issueSession(payload, userId)
          const response = NextResponse.redirect(
               new URL(flow.next ?? authRoutes.afterLogin, url.origin),
          )
          response.cookies.set(authCookieName(payload), token, authCookieOptions(exp))
          response.cookies.set(GOOGLE_FLOW_COOKIE, '', { ...flowCookie, maxAge: 0 })
          return response
     } catch (error) {
          // e.g. "Google token exchange failed: 401 invalid_client" → wrong secret on the server
          logGoogle('error', 'sign-in failed:', error)
          return fail('failed')
     }
}

/**
 * 1. A user already linked to this Google account → sign them in.
 * 2. A user with the same (Google-verified) email → link Google to that account.
 * 3. Otherwise → create a new owner account (Google already verified the email).
 * Returns null if the email belongs to a user linked to a DIFFERENT Google account.
 */
async function findOrCreateGoogleUser(
     payload: Payload,
     profile: GoogleProfile,
): Promise<number | string | null> {
     // db-level lookups: `googleSub` is a hidden field, so it isn't queryable through the API
     const bySub = await payload.db.findOne<{ id: number | string }>({
          collection: 'users',
          where: { googleSub: { equals: profile.sub } },
     })
     if (bySub) return bySub.id

     const byEmail = await payload.db.findOne<{
          id: number | string
          googleSub?: string | null
          name?: string | null
     }>({
          collection: 'users',
          where: { email: { equals: profile.email } },
     })
     if (byEmail) {
          if (byEmail.googleSub && byEmail.googleSub !== profile.sub) return null
          await payload.update({
               collection: 'users',
               id: byEmail.id,
               data: { googleSub: profile.sub, ...(byEmail.name ? {} : { name: profile.name }) },
               overrideAccess: true,
          })
          return byEmail.id
     }

     try {
          const created = await payload.create({
               collection: 'users',
               data: {
                    email: profile.email,
                    name: profile.name,
                    googleSub: profile.sub,
                    // Required by Payload's local auth; never shown. They can set their own via "Forgot password".
                    password: randomToken(32),
                    // The Google button sits under "By continuing you agree to the Terms…"
                    acceptedTermsAt: new Date().toISOString(),
               },
               overrideAccess: true,
          })
          return created.id
     } catch (error) {
          // Two callbacks raced on the unique email/googleSub — use the row the other one created
          const again = await payload.db.findOne<{ id: number | string }>({
               collection: 'users',
               where: { googleSub: { equals: profile.sub } },
          })
          if (again) return again.id
          throw error
     }
}
