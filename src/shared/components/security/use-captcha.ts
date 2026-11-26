'use client'

import { useCallback, useState } from 'react'

import { turnstileSiteKey } from '@/shared/security/turnstile-config'

/**
 * State for one <Turnstile> widget: spread `widget` onto it, call `ensure()` before submitting
 * and `reset()` after every server response (tokens are single-use).
 */
export function useCaptcha() {
     const [token, setToken] = useState<string | null>(null)
     const [resetKey, setResetKey] = useState(0)
     const [missing, setMissing] = useState(false)

     const onToken = useCallback((next: string | null) => {
          setToken(next)
          if (next) setMissing(false)
     }, [])

     /** true when the form may be sent; otherwise shows the "complete the check" message */
     const ensure = () => {
          if (!turnstileSiteKey || token) return true
          setMissing(true)
          return false
     }

     const reset = useCallback(() => setResetKey((k) => k + 1), [])

     return { missing, ensure, reset, widget: { resetKey, onToken } }
}
