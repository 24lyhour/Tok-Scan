'use client'

import { LogOut } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button } from 'react-aria-components'

import type { CommonMessages } from '@/i18n/messages'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'
import { cn } from '@/shared/lib/utils'

import { logoutAction } from './actions'

type Texts = CommonMessages['logout'] & { cancel: string }

/** Sidebar log-out icon → "Log out?" dialog → server logout → `loginHref`. */
export function LogoutButton({
     label,
     texts,
     loginHref,
     className,
}: {
     label: string
     texts: Texts
     /** Where to land afterwards: /login (owners) or the staff login (console) */
     loginHref: string
     className?: string
}) {
     return (
          <ConfirmDialog
               title={texts.title}
               description={texts.body}
               trigger={
                    <Button
                         aria-label={label}
                         className={cn(
                              'flex size-9 cursor-pointer items-center justify-center rounded-lg outline-none data-focus-visible:ring-3 data-focus-visible:ring-white/40',
                              className,
                         )}
                    >
                         <LogOut aria-hidden className="size-[18px]" />
                    </Button>
               }
               actions={(close) => (
                    <>
                         <button
                              type="button"
                              onClick={close}
                              className="h-11 rounded-xl border border-line px-5 text-sm font-semibold text-ink hover:bg-paper"
                         >
                              {texts.cancel}
                         </button>
                         <form action={logoutAction}>
                              <input type="hidden" name="next" value={loginHref} />
                              <ConfirmButton label={texts.confirm} pendingLabel={texts.pending} />
                         </form>
                    </>
               )}
          />
     )
}

function ConfirmButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
     const { pending } = useFormStatus()
     return (
          <button
               type="submit"
               disabled={pending}
               autoFocus
               className="h-11 w-full rounded-xl bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
          >
               {pending ? pendingLabel : label}
          </button>
     )
}
