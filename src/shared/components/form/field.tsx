'use client'

import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'

/** Form field building blocks (guide p.03: input radius 11, 48px tall, 44px+ touch targets). */

export const inputClass =
     'h-12 w-full rounded-[11px] border border-line bg-white px-3.5 text-[0.9375rem] text-ink placeholder:text-ink-3 outline-none transition-[border-color,box-shadow] duration-[120ms] focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 aria-invalid:border-error aria-invalid:focus:ring-error/15'

/** Red * after a required field's label. Hidden from screen readers: the input's `required` is announced. */
export function RequiredMark() {
     return (
          <span aria-hidden className="ml-0.5 text-error">
               *
          </span>
     )
}

export function Field({
     id,
     label,
     labelAction,
     hint,
     error,
     required = false,
     children,
}: {
     id: string
     label: string
     /** Shows a red * after the label (the input itself still needs `required`) */
     required?: boolean
     /** Small link on the right of the label, e.g. "Forgot password?" */
     labelAction?: ReactNode
     hint?: string
     error?: string
     children: ReactNode
}) {
     return (
          <div>
               <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <label htmlFor={id} className="block text-sm font-medium text-ink">
                         {label}
                         {required && <RequiredMark />}
                    </label>
                    {labelAction}
               </div>
               {children}
               {error ? (
                    <p
                         id={`${id}-error`}
                         className="mt-1.5 flex items-start gap-1.5 text-xs text-error"
                    >
                         <AlertCircle aria-hidden className="mt-px size-3.5 shrink-0" />
                         {error}
                    </p>
               ) : hint ? (
                    <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-3">
                         {hint}
                    </p>
               ) : null}
          </div>
     )
}

/** Error banner at the top of a form; announced to screen readers. */
export function FormAlert({ message }: { message?: string }) {
     return (
          <div aria-live="polite">
               {message && (
                    <p
                         role="alert"
                         className="mb-4 flex items-start gap-2 rounded-xl bg-error/8 px-3.5 py-3 text-sm text-error"
                    >
                         <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
                         {message}
                    </p>
               )}
          </div>
     )
}
