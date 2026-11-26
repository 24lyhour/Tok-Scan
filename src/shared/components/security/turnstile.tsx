'use client'

import { useEffect, useRef } from 'react'

import { getLocaleConfig, type Locale } from '@/shared/i18n/locales'
import { type TurnstileAction, turnstileSiteKey } from '@/shared/security/turnstile-config'
import { cn } from '@/shared/lib/utils'

type TurnstileApi = {
     render: (el: HTMLElement, options: Record<string, unknown>) => string
     reset: (widgetId: string) => void
     remove: (widgetId: string) => void
}

declare global {
     interface Window {
          turnstile?: TurnstileApi
     }
}

const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/** Load Cloudflare's script once per page, shared by every widget. */
function loadTurnstile(): Promise<TurnstileApi> {
     if (window.turnstile) return Promise.resolve(window.turnstile)
     return new Promise((resolve, reject) => {
          let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
          if (!script) {
               script = document.createElement('script')
               script.id = SCRIPT_ID
               script.src = SCRIPT_SRC
               script.async = true
               script.defer = true
               document.head.appendChild(script)
          }
          script.addEventListener('load', () =>
               window.turnstile ? resolve(window.turnstile) : reject(),
          )
          script.addEventListener('error', () => reject(new Error('Turnstile failed to load')))
     })
}

/**
 * Cloudflare Turnstile widget. Put it INSIDE the <form>: it adds a hidden
 * `cf-turnstile-response` input that the server action verifies.
 * Bump `resetKey` after every submit — tokens can only be used once.
 */
export function Turnstile({
     action,
     locale,
     resetKey,
     onToken,
     className,
}: {
     action: TurnstileAction
     locale: Locale
     resetKey: number
     onToken: (token: string | null) => void
     className?: string
}) {
     const containerRef = useRef<HTMLDivElement>(null)
     const widgetIdRef = useRef<string | null>(null)
     // Latest callback for the widget's events (updated after render, read later by the widget)
     const onTokenRef = useRef(onToken)
     useEffect(() => {
          onTokenRef.current = onToken
     }, [onToken])

     useEffect(() => {
          if (!turnstileSiteKey) return
          let cancelled = false
          loadTurnstile()
               .then((api) => {
                    if (cancelled || !containerRef.current || widgetIdRef.current) return
                    widgetIdRef.current = api.render(containerRef.current, {
                         sitekey: turnstileSiteKey,
                         action,
                         theme: 'light',
                         // Invisible for almost everyone; a checkbox appears only if Cloudflare is unsure
                         appearance: 'interaction-only',
                         // 'flexible' needs ≥300px; small phones get the compact widget instead
                         size: containerRef.current.offsetWidth >= 300 ? 'flexible' : 'compact',
                         language: getLocaleConfig(locale).turnstile,
                         callback: (token: string) => onTokenRef.current(token),
                         'expired-callback': () => onTokenRef.current(null),
                         'error-callback': () => onTokenRef.current(null),
                    })
               })
               .catch(() => onTokenRef.current(null))
          return () => {
               cancelled = true
               if (widgetIdRef.current && window.turnstile)
                    window.turnstile.remove(widgetIdRef.current)
               widgetIdRef.current = null
          }
     }, [action, locale])

     useEffect(() => {
          if (resetKey > 0 && widgetIdRef.current && window.turnstile) {
               window.turnstile.reset(widgetIdRef.current)
               onTokenRef.current(null)
          }
     }, [resetKey])

     if (!turnstileSiteKey) return null
     // Empty (no height) until Cloudflare needs a click — then the checkbox appears here
     return <div ref={containerRef} className={cn('w-full', className)} />
}
