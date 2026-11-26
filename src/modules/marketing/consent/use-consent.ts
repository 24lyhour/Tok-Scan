'use client'

import { useSyncExternalStore } from 'react'

import { CONSENT_COOKIE, CONSENT_MAX_AGE, isConsent, type Consent } from './consent'

const listeners = new Set<() => void>()

function readConsent(): Consent | null {
     const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`))
     return isConsent(match?.[1]) ? match[1] : null
}

/** Save the choice and tell every component that uses `useConsent`. */
export function saveConsent(value: Consent) {
     document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE}; samesite=lax`
     for (const notify of listeners) notify()
}

/**
 * Current cookie choice (null = not chosen yet). `initial` is what the server read, so the
 * first render matches the HTML.
 */
export function useConsent(initial: Consent | null): Consent | null {
     return useSyncExternalStore(
          (notify) => {
               listeners.add(notify)
               return () => listeners.delete(notify)
          },
          readConsent,
          () => initial,
     )
}
