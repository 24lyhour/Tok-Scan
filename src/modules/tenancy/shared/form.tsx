'use client'

import { AlertCircle, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useState, type ComponentProps, type ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

/** Form building blocks shared by login and sign-up (guide p.03: input radius 11, 48px tall, 44px+ targets). */

export const inputClass =
     'h-12 w-full rounded-[11px] border border-line bg-white px-3.5 text-[0.9375rem] text-ink placeholder:text-ink-3 outline-none transition-[border-color,box-shadow] duration-[120ms] focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 aria-invalid:border-error aria-invalid:focus:ring-error/15'

export function Field({
     id,
     label,
     labelAction,
     hint,
     error,
     children,
}: {
     id: string
     label: string
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

/** Password input with a show/hide button. */
export function PasswordInput({
     showLabel,
     hideLabel,
     className,
     ...props
}: Omit<ComponentProps<'input'>, 'type'> & { showLabel: string; hideLabel: string }) {
     const [visible, setVisible] = useState(false)
     return (
          <div className="relative">
               <input
                    {...props}
                    type={visible ? 'text' : 'password'}
                    className={cn(inputClass, 'pr-12', className)}
               />
               <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? hideLabel : showLabel}
                    aria-pressed={visible}
                    aria-controls={props.id}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-[11px] text-ink-3 hover:text-ink"
               >
                    {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
               </button>
          </div>
     )
}

function GoogleIcon() {
     return (
          <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]">
               <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
               />
               <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
               />
               <path
                    fill="#FBBC05"
                    d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"
               />
               <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
               />
          </svg>
     )
}

function AppleIcon() {
     return (
          <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="currentColor">
               <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
          </svg>
     )
}

const socialButton =
     'inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl text-[0.9375rem] font-semibold disabled:cursor-not-allowed disabled:opacity-60'

/**
 * "Continue with Apple" + "Continue with Google", followed by an "or" divider.
 * Both are disabled until the providers are configured (Apple needs an Apple Developer account,
 * Google an OAuth client). Apple's button is black with the Apple logo and the same size as
 * Google's, as Apple's Human Interface Guidelines require.
 */
export function SocialSignIn({
     id,
     appleLabel,
     googleLabel,
     soonLabel,
     orLabel,
}: {
     id: string
     appleLabel: string
     googleLabel: string
     soonLabel: string
     orLabel: string
}) {
     return (
          <>
               <div className="space-y-2.5">
                    <button
                         type="button"
                         disabled
                         title={soonLabel}
                         aria-describedby={`${id}-soon`}
                         className={cn(socialButton, 'bg-black text-white')}
                    >
                         <AppleIcon />
                         {appleLabel}
                    </button>
                    <button
                         type="button"
                         disabled
                         title={soonLabel}
                         aria-describedby={`${id}-soon`}
                         className={cn(socialButton, 'border border-line bg-white text-ink')}
                    >
                         <GoogleIcon />
                         {googleLabel}
                    </button>
               </div>
               <p id={`${id}-soon`} className="mt-2 text-center text-xs text-ink-3">
                    {soonLabel}
               </p>
               <div className="my-5 flex items-center gap-3 text-xs text-ink-3" aria-hidden>
                    <span className="h-px flex-1 bg-line" />
                    {orLabel}
                    <span className="h-px flex-1 bg-line" />
               </div>
          </>
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

export function SubmitButton({
     pending,
     label,
     pendingLabel,
}: {
     pending: boolean
     label: string
     pendingLabel: string
}) {
     return (
          <button
               type="submit"
               disabled={pending}
               className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-[0.9375rem] font-semibold text-white transition-colors duration-[120ms] outline-none hover:bg-brand-800 focus-visible:ring-3 focus-visible:ring-brand-300 disabled:cursor-wait disabled:opacity-80"
          >
               {pending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
               {pending ? pendingLabel : label}
          </button>
     )
}
