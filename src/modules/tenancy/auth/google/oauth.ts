import { createHash, randomBytes } from 'node:crypto'

/**
 * Google OpenID Connect — Authorization Code flow with PKCE.
 * https://developers.google.com/identity/openid-connect/openid-connect
 */
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const ISSUERS = new Set(['https://accounts.google.com', 'accounts.google.com'])

const base64url = (buf: Buffer) => buf.toString('base64url')

export function randomToken(bytes = 32): string {
     return base64url(randomBytes(bytes))
}

/** PKCE S256 challenge for a verifier. */
export function pkceChallenge(verifier: string): string {
     return base64url(createHash('sha256').update(verifier).digest())
}

export function buildAuthorizationUrl(args: {
     clientId: string
     redirectUri: string
     state: string
     codeVerifier: string
     nonce: string
}): string {
     const params = new URLSearchParams({
          client_id: args.clientId,
          redirect_uri: args.redirectUri,
          response_type: 'code',
          scope: 'openid email profile',
          state: args.state,
          nonce: args.nonce,
          code_challenge: pkceChallenge(args.codeVerifier),
          code_challenge_method: 'S256',
          // Always let people pick which Google account to use
          prompt: 'select_account',
     })
     return `${AUTH_URL}?${params}`
}

export type GoogleProfile = {
     sub: string
     email: string
     emailVerified: boolean
     name?: string
     picture?: string
}

/**
 * Exchange the one-time code for tokens and read the user's identity from the ID token.
 *
 * The ID token comes straight from Google's token endpoint over TLS, authenticated with our client
 * secret, so per OpenID Connect Core §3.1.3.7 TLS validation replaces checking its signature.
 * We still validate issuer, audience, expiry and nonce.
 */
export async function exchangeCodeForProfile(args: {
     code: string
     codeVerifier: string
     clientId: string
     clientSecret: string
     redirectUri: string
     nonce: string
}): Promise<GoogleProfile> {
     const res = await fetch(TOKEN_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
               grant_type: 'authorization_code',
               code: args.code,
               code_verifier: args.codeVerifier,
               client_id: args.clientId,
               client_secret: args.clientSecret,
               redirect_uri: args.redirectUri,
          }),
          cache: 'no-store',
          signal: AbortSignal.timeout(10_000),
     })
     const body = (await res.json().catch(() => ({}))) as { id_token?: string; error?: string }
     if (!res.ok || !body.id_token) {
          throw new Error(`Google token exchange failed: ${res.status} ${body.error ?? ''}`.trim())
     }

     const [, payloadPart] = body.id_token.split('.')
     if (!payloadPart) throw new Error('Google returned a malformed ID token')
     const claims = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as Record<
          string,
          unknown
     >

     const now = Math.floor(Date.now() / 1000)
     const aud = claims.aud
     if (!ISSUERS.has(String(claims.iss))) throw new Error('ID token: wrong issuer')
     if (!(aud === args.clientId || (Array.isArray(aud) && aud.includes(args.clientId)))) {
          throw new Error('ID token: wrong audience')
     }
     if (typeof claims.exp !== 'number' || claims.exp < now - 60)
          throw new Error('ID token: expired')
     if (claims.nonce !== args.nonce) throw new Error('ID token: nonce mismatch')
     if (typeof claims.sub !== 'string' || typeof claims.email !== 'string') {
          throw new Error('ID token: missing sub or email')
     }

     return {
          sub: claims.sub,
          email: claims.email.trim().toLowerCase(),
          emailVerified: claims.email_verified === true || claims.email_verified === 'true',
          name: typeof claims.name === 'string' ? claims.name : undefined,
          picture: typeof claims.picture === 'string' ? claims.picture : undefined,
     }
}
