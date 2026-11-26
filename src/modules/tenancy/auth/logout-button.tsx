'use client'

import { LogOut } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * Log out through Payload's own endpoint (clears the cookie AND ends the server session),
 * then go to the login page.
 */
export function LogoutButton({
     label,
     loginHref,
     className,
}: {
     label: string
     loginHref: string
     className?: string
}) {
     const [busy, setBusy] = useState(false)
     const logout = async () => {
          setBusy(true)
          try {
               await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
          } finally {
               window.location.assign(loginHref)
          }
     }
     return (
          <button
               type="button"
               onClick={logout}
               disabled={busy}
               aria-label={label}
               title={label}
               className={cn(
                    'flex size-9 items-center justify-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-white/40 disabled:opacity-50',
                    className,
               )}
          >
               <LogOut aria-hidden className="size-[18px]" />
          </button>
     )
}
