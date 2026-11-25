import { headers } from 'next/headers'

import type { TurnstileAction } from './turnstile-config'

/** Cloudflare's official test secret — always passes. Used only in development without real keys. */
const TEST_SECRET = '1x0000000000000000000000000000000AA'
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

type SiteverifyResponse = {
     success: boolean
     action?: string
     hostname?: string
     'error-codes'?: string[]
}

/**
 * Server-side Turnstile check. Call it in a server action BEFORE doing the real work
 * (login, account creation). Tokens are single-use and expire after 5 minutes.
 * Fails closed: missing token, missing secret in production, or network error → false.
 */
export async function verifyTurnstile(
     token: unknown,
     expectedAction: TurnstileAction,
): Promise<boolean> {
     const secret =
          process.env.TURNSTILE_SECRET_KEY ||
          (process.env.NODE_ENV !== 'production' ? TEST_SECRET : '')
     if (!secret) {
          console.error('[turnstile] TURNSTILE_SECRET_KEY is not set — rejecting the request')
          return false
     }
     if (typeof token !== 'string' || !token || token.length > 2048) return false

     const h = await headers()
     const ip = h.get('cf-connecting-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim()

     try {
          const res = await fetch(SITEVERIFY_URL, {
               method: 'POST',
               body: new URLSearchParams({
                    secret,
                    response: token,
                    ...(ip ? { remoteip: ip } : {}),
               }),
               cache: 'no-store',
               signal: AbortSignal.timeout(8000),
          })
          const data = (await res.json()) as SiteverifyResponse
          if (!data.success) {
               console.warn('[turnstile] verification failed', data['error-codes'])
               return false
          }
          // Test keys don't echo the action; real keys do — reject tokens minted for another form.
          if (data.action && data.action !== expectedAction) return false
          return true
     } catch (error) {
          console.error('[turnstile] siteverify request failed', error)
          return false
     }
}
