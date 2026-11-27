'use client'

import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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

/** Local development (`yarn dev`) always shows Cloudflare's box so the check can be seen and tested. */
const SHOW_BOX_LOCALLY = process.env.NODE_ENV === 'development'

/** Status texts for the branded line under the form (from `common.security`). */
export type TurnstileStatusText = { checking: string; verified: string; failed: string }
type State = 'checking' | 'verified' | 'failed' | 'interactive'

/**
 * Cloudflare Turnstile widget. Put it INSIDE the <form>: it adds a hidden
 * `cf-turnstile-response` input that the server action verifies.
 * Bump `resetKey` after every submit — tokens can only be used once.
 *
 * With `status` (tok-scan's own forms, via useCaptcha): on the live site Cloudflare's grey box
 * stays hidden for visitors who pass (locally it is always shown, for testing), and a small line
 * in tok-scan's style says "Checking… → ✓ Verified" (or why
 * it failed). The box only appears when Cloudflare needs a click.
 * Without `status` (Payload admin login): Cloudflare's box is always shown.
 */
export function Turnstile({
     action,
     locale,
     resetKey,
     onToken,
     status,
     className,
}: {
     action: TurnstileAction
     locale: Locale
     resetKey: number
     onToken: (token: string | null) => void
     status?: TurnstileStatusText
     className?: string
}) {
     const [state, setState] = useState<State>('checking')
     const branded = Boolean(status)
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
                         // Branded forms on the live site: hidden unless Cloudflare needs a click.
                         // Locally, and without branding (Payload admin): always shown.
                         appearance: branded && !SHOW_BOX_LOCALLY ? 'interaction-only' : 'always',
                         // 'flexible' needs ≥300px; small phones get the compact widget instead
                         size: containerRef.current.offsetWidth >= 300 ? 'flexible' : 'compact',
                         language: getLocaleConfig(locale).turnstile,
                         callback: (token: string) => {
                              setState('verified')
                              onTokenRef.current(token)
                         },
                         'expired-callback': () => {
                              setState('checking')
                              onTokenRef.current(null)
                         },
                         'error-callback': () => {
                              setState('failed')
                              onTokenRef.current(null)
                         },
                         'before-interactive-callback': () => setState('interactive'),
                         'after-interactive-callback': () => setState('checking'),
                    })
               })
               .catch(() => {
                    setState('failed')
                    onTokenRef.current(null)
               })
          return () => {
               cancelled = true
               if (widgetIdRef.current && window.turnstile)
                    window.turnstile.remove(widgetIdRef.current)
               widgetIdRef.current = null
          }
     }, [action, locale, branded])

     useEffect(() => {
          if (resetKey > 0 && widgetIdRef.current && window.turnstile) {
               window.turnstile.reset(widgetIdRef.current)
               setState('checking')
               onTokenRef.current(null)
          }
     }, [resetKey])

     if (!turnstileSiteKey) return null
     if (!branded) {
          // min-h reserves the widget's height so the button below doesn't jump when it appears
          return <div ref={containerRef} className={cn('min-h-16.25 w-full', className)} />
     }
     return (
          <div className={cn('w-full', className)}>
               {/* Empty unless Cloudflare needs a click — then its checkbox appears here */}
               <div ref={containerRef} data-turnstile-box />
               {state !== 'interactive' && status && <StatusLine state={state} text={status} />}
          </div>
     )
}

/** One quiet line in tok-scan's style: spinner → green shield → red message. */
function StatusLine({
     state,
     text,
}: {
     state: Exclude<State, 'interactive'>
     text: TurnstileStatusText
}) {
     const Icon = state === 'verified' ? ShieldCheck : state === 'failed' ? ShieldAlert : Loader2
     return (
          <p
               role="status"
               aria-live="polite"
               className={cn(
                    'flex items-center justify-center gap-1.5 text-xs',
                    state === 'verified' && 'text-success',
                    state === 'failed' && 'text-error',
                    state === 'checking' && 'text-ink-3',
               )}
          >
               <Icon
                    aria-hidden
                    className={cn(
                         'size-3.5 shrink-0',
                         state === 'checking' && 'motion-safe:animate-spin',
                    )}
               />
               {text[state]}
          </p>
     )
}
