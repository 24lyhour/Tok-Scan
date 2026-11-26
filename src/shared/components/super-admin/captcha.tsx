'use client'

import { useTranslation } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

import { Turnstile } from '@/shared/components/security/turnstile'
import type { Locale } from '@/shared/i18n/locales'
import { TURNSTILE_COOKIE } from '@/shared/security/turnstile-config'

/** Hand the token to Payload's login API (checked by the users collection's beforeOperation hook). */
function storeToken(token: string | null) {
     const attrs = `Path=/api; SameSite=Strict${location.protocol === 'https:' ? '; Secure' : ''}`
     document.cookie = token
          ? `${TURNSTILE_COOKIE}=${encodeURIComponent(token)}; Max-Age=300; ${attrs}`
          : `${TURNSTILE_COOKIE}=; Max-Age=0; ${attrs}`
}

/**
 * Cloudflare Turnstile for /admin/login (Payload `afterLogin`). Invisible for almost everyone (a checkbox appears only
 * when Cloudflare is unsure). Payload's form can't carry extra fields, so the token travels as a
 * short-lived cookie sent only to /api.
 */
export function AdminLoginCaptcha() {
     // The admin speaks en · zh; Turnstile gets the same language
     const { i18n } = useTranslation()
     const locale: Locale = i18n.language === 'zh' ? 'zh' : 'en'
     const [resetKey, setResetKey] = useState(0)

     useEffect(() => {
          // Tokens are single-use: fetch a fresh one shortly after every login attempt
          const onSubmit = (event: Event) => {
               if (!(event.target instanceof Element) || !event.target.closest('.login__form'))
                    return
               window.setTimeout(() => setResetKey((k) => k + 1), 1500)
          }
          document.addEventListener('submit', onSubmit, true)
          return () => {
               document.removeEventListener('submit', onSubmit, true)
               storeToken(null)
          }
     }, [])

     return (
          <Turnstile
               action="admin-login"
               locale={locale}
               resetKey={resetKey}
               onToken={storeToken}
          />
     )
}
