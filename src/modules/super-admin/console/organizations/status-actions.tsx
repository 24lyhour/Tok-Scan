'use client'

import { Check, Eye, MessageSquare, RotateCcw } from 'lucide-react'
import { useState, useTransition } from 'react'

import { useTranslations } from '@/i18n/client'
import type { OrgStatus } from '@/modules/tenancy'
import { interpolate } from '@/shared/i18n/format'
import { cn } from '@/shared/lib/utils'

import { changeOrgStatus } from './actions'
import { STATUS_ACTIONS, type StatusAction } from './query'

const button =
     'flex h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-colors duration-[120ms] disabled:cursor-not-allowed disabled:opacity-60'

/**
 * Bottom of the detail panel (guide p.27): Request info · Approve · View as tenant · Suspend…
 * Suspending asks for confirmation first. Request info / View as tenant come later.
 */
export function StatusActions({
     id,
     name,
     status,
}: {
     id: number
     name: string
     status: OrgStatus
}) {
     const { m } = useTranslations('console')
     const common = useTranslations('common').m
     const copy = m.detail
     const [pending, startTransition] = useTransition()
     const [confirming, setConfirming] = useState(false)
     const [error, setError] = useState<string | null>(null)
     const allowed = STATUS_ACTIONS[status]

     const run = (action: StatusAction) =>
          startTransition(async () => {
               setError(null)
               const result = await changeOrgStatus({ id, action })
               if (!result.ok) setError(m.errors[result.error])
               setConfirming(false)
          })

     if (confirming) {
          return (
               <div className="space-y-3 border-t border-line p-4">
                    <p className="text-sm text-ink">
                         {interpolate(copy.suspendQuestion, { name })}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                         <button
                              type="button"
                              onClick={() => setConfirming(false)}
                              disabled={pending}
                              className={cn(
                                   button,
                                   'border border-line bg-white text-ink hover:bg-paper',
                              )}
                         >
                              {copy.cancel}
                         </button>
                         <button
                              type="button"
                              onClick={() => run('suspend')}
                              disabled={pending}
                              className={cn(button, 'bg-error text-white hover:bg-error/90')}
                         >
                              {pending ? common.states.saving : copy.confirmSuspend}
                         </button>
                    </div>
               </div>
          )
     }

     return (
          <div className="space-y-2 border-t border-line p-4">
               {error && (
                    <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-xs text-error">
                         {error}
                    </p>
               )}
               <div className="grid grid-cols-2 gap-2">
                    <button
                         type="button"
                         disabled
                         title={common.states.soon}
                         className={cn(button, 'border border-line bg-white text-ink')}
                    >
                         <MessageSquare aria-hidden className="size-4" />
                         {copy.requestInfo}
                    </button>
                    {allowed.includes('reactivate') ? (
                         <button
                              type="button"
                              onClick={() => run('reactivate')}
                              disabled={pending}
                              className={cn(button, 'bg-brand-700 text-white hover:bg-brand-800')}
                         >
                              <RotateCcw aria-hidden className="size-4" />
                              {pending ? common.states.saving : copy.reactivate}
                         </button>
                    ) : (
                         <button
                              type="button"
                              onClick={() => run('approve')}
                              disabled={pending || !allowed.includes('approve')}
                              className={cn(button, 'bg-brand-700 text-white hover:bg-brand-800')}
                         >
                              <Check aria-hidden className="size-4" />
                              {pending ? common.states.saving : copy.approve}
                         </button>
                    )}
                    <button
                         type="button"
                         disabled
                         title={common.states.soon}
                         className={cn(button, 'border border-line bg-white text-ink')}
                    >
                         <Eye aria-hidden className="size-4" />
                         {copy.viewAsTenant}
                    </button>
                    <button
                         type="button"
                         onClick={() => setConfirming(true)}
                         disabled={pending || !allowed.includes('suspend')}
                         className={cn(button, 'bg-error/10 text-error hover:bg-error/15')}
                    >
                         {copy.suspend}
                    </button>
               </div>
          </div>
     )
}
