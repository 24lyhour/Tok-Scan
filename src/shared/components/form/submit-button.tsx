'use client'

import { LoaderCircle } from 'lucide-react'
import { useId, type ComponentProps } from 'react'

import { useTranslations } from '@/i18n/client'

import { cn } from '@/shared/lib/utils'

/** Primary (filled) or secondary (outlined) submit button. `name`/`value` say which one was clicked. */
/**
 * Primary (filled) or secondary (outlined) submit button. `name`/`value` say which one was clicked.
 * While it's disabled because required fields are empty, a short line under it says why
 * (turn off with `hint={false}`, e.g. on the second of two buttons).
 */
export function SubmitButton({
     pending,
     label,
     pendingLabel,
     variant = 'primary',
     disabled,
     hint = true,
     ...props
}: {
     pending: boolean
     label: string
     pendingLabel: string
     variant?: 'primary' | 'secondary'
     /** Explain a disabled button ("Fill in all fields marked *") */
     hint?: boolean
} & Pick<ComponentProps<'button'>, 'name' | 'value' | 'disabled' | 'onClick'>) {
     const { m } = useTranslations('common')
     const hintId = useId()
     const blocked = Boolean(disabled) && !pending && hint
     return (
          <>
               <button
                    type="submit"
                    disabled={pending || disabled}
                    aria-describedby={blocked ? hintId : undefined}
                    {...props}
                    className={cn(
                         'inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[0.9375rem] font-semibold transition-[background-color,opacity] duration-[120ms] outline-none focus-visible:ring-3 focus-visible:ring-brand-300',
                         // Sending → wait cursor; not ready (required fields empty) → faded, not clickable
                         pending
                              ? 'cursor-wait opacity-80'
                              : 'disabled:cursor-not-allowed disabled:opacity-45',
                         variant === 'primary'
                              ? 'bg-brand-700 text-white enabled:hover:bg-brand-800'
                              : 'border border-line bg-white text-ink enabled:hover:bg-paper',
                    )}
               >
                    {pending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
                    {pending ? pendingLabel : label}
               </button>
               {blocked && (
                    <p id={hintId} className="mt-2 text-center text-xs text-ink-3">
                         {m.states.fillRequired} <span className="text-error">*</span>
                    </p>
               )}
          </>
     )
}
