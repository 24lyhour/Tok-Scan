import 'server-only'

import { cookies } from 'next/headers'

import { CONSENT_COOKIE, isConsent, type Consent } from './consent'

/** The visitor's cookie choice, or null when they haven't chosen yet. */
export async function getConsent(): Promise<Consent | null> {
     const value = (await cookies()).get(CONSENT_COOKIE)?.value
     return isConsent(value) ? value : null
}
