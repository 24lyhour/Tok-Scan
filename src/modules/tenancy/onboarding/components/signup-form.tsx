'use client'

import { AlertCircle, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import {
     useActionState,
     useEffect,
     useId,
     useRef,
     useState,
     useTransition,
     type FormEvent,
     type ReactNode,
} from 'react'

import { useTranslations } from '@/i18n/client'
import { cn } from '@/shared/lib/utils'

import { signupAction, type SignupState } from '../actions'
import { PASSWORD_MIN, type SignupErrorCode, type SignupField, validateSignup } from '../validation'

type Errors = Partial<Record<SignupField, SignupErrorCode>>

const FIELD_ORDER: SignupField[] = ['name', 'email', 'phone', 'password', 'terms']

const inputClass =
     'h-12 w-full rounded-[11px] border border-line bg-white px-3.5 text-[0.9375rem] text-ink placeholder:text-ink-3 outline-none transition-[border-color,box-shadow] duration-[120ms] focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 aria-invalid:border-error aria-invalid:focus:ring-error/15'

function Field({
     id,
     label,
     hint,
     error,
     children,
}: {
     id: string
     label: string
     hint?: string
     error?: string
     children: ReactNode
}) {
     return (
          <div>
               <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
                    {label}
               </label>
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

export function SignupForm({ loginHref }: { loginHref: string }) {
     const t = useTranslations('onboarding').m.signup
     const uid = useId()
     const ids = {
          name: `${uid}-name`,
          email: `${uid}-email`,
          phone: `${uid}-phone`,
          password: `${uid}-password`,
          terms: `${uid}-terms`,
     } satisfies Record<SignupField, string>

     const [values, setValues] = useState({
          name: '',
          email: '',
          phone: '',
          password: '',
          terms: false,
     })
     const [errors, setErrors] = useState<Errors>({})
     const [showPassword, setShowPassword] = useState(false)
     const [state, dispatch, pending] = useActionState<SignupState, FormData>(signupAction, {
          status: 'idle',
     })
     const [, startTransition] = useTransition()
     const formRef = useRef<HTMLFormElement>(null)

     const focusFirstError = (errs: Errors) => {
          const first = FIELD_ORDER.find((f) => errs[f])
          if (first) document.getElementById(ids[first])?.focus()
     }

     // Errors coming back from the server (e.g. email already used)
     useEffect(() => {
          if (state.status === 'error' && state.fieldErrors) {
               setErrors(state.fieldErrors)
               focusFirstError(state.fieldErrors)
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [state])

     const update = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) => {
          setValues((v) => ({ ...v, [key]: value }))
          if (errors[key as SignupField]) setErrors((e) => ({ ...e, [key]: undefined }))
     }

     const onSubmit = (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const check = validateSignup(values)
          if (!check.ok) {
               setErrors(check.fieldErrors)
               focusFirstError(check.fieldErrors)
               return
          }
          setErrors({})
          // Manual dispatch (instead of <form action>) so React doesn't reset the inputs on error
          const data = new FormData(e.currentTarget)
          startTransition(() => dispatch(data))
     }

     const msg = (field: SignupField) => {
          const code = errors[field]
          return code ? t.errors[code] : undefined
     }
     const describedBy = (field: SignupField, hasHint = false) =>
          errors[field] ? `${ids[field]}-error` : hasHint ? `${ids[field]}-hint` : undefined
     const hasErrors = Object.values(errors).some(Boolean)

     return (
          <form ref={formRef} noValidate onSubmit={onSubmit} className="flex flex-1 flex-col">
               <button
                    type="button"
                    disabled
                    title={t.googleSoon}
                    aria-describedby={`${uid}-google-soon`}
                    className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white text-[0.9375rem] font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
               >
                    <GoogleIcon />
                    {t.google}
               </button>
               <p id={`${uid}-google-soon`} className="mt-1.5 text-center text-xs text-ink-3">
                    {t.googleSoon}
               </p>

               <div className="my-5 flex items-center gap-3 text-xs text-ink-3" aria-hidden>
                    <span className="h-px flex-1 bg-line" />
                    {t.or}
                    <span className="h-px flex-1 bg-line" />
               </div>

               <div aria-live="polite">
                    {(state.formError || hasErrors) && (
                         <p
                              role="alert"
                              className="mb-4 flex items-start gap-2 rounded-xl bg-error/8 px-3.5 py-3 text-sm text-error"
                         >
                              <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
                              {state.formError && !hasErrors
                                   ? t.errors[state.formError]
                                   : t.errorSummary}
                         </p>
                    )}
               </div>

               <div className="space-y-4">
                    <Field id={ids.name} label={t.name} error={msg('name')}>
                         <input
                              id={ids.name}
                              name="name"
                              autoComplete="name"
                              required
                              maxLength={80}
                              placeholder={t.namePlaceholder}
                              value={values.name}
                              onChange={(e) => update('name', e.target.value)}
                              aria-invalid={!!errors.name || undefined}
                              aria-describedby={describedBy('name')}
                              className={inputClass}
                         />
                    </Field>

                    <Field id={ids.email} label={t.email} error={msg('email')}>
                         <input
                              id={ids.email}
                              name="email"
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              autoCapitalize="none"
                              spellCheck={false}
                              required
                              placeholder={t.emailPlaceholder}
                              value={values.email}
                              onChange={(e) => update('email', e.target.value)}
                              aria-invalid={!!errors.email || undefined}
                              aria-describedby={describedBy('email')}
                              className={inputClass}
                         />
                         {errors.email === 'emailTaken' && (
                              <Link
                                   href={loginHref}
                                   className="mt-1 inline-block text-xs font-semibold text-brand-700 hover:underline"
                              >
                                   {t.login} →
                              </Link>
                         )}
                    </Field>

                    <Field id={ids.phone} label={t.phone} hint={t.phoneHint} error={msg('phone')}>
                         <div className="relative">
                              <span
                                   aria-hidden
                                   className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-line pr-3 pl-3.5 text-[0.9375rem] text-ink-2 tabular"
                              >
                                   +855
                              </span>
                              <input
                                   id={ids.phone}
                                   name="phone"
                                   type="tel"
                                   inputMode="tel"
                                   autoComplete="tel-national"
                                   required
                                   placeholder="12 345 678"
                                   value={values.phone}
                                   onChange={(e) => update('phone', e.target.value)}
                                   aria-invalid={!!errors.phone || undefined}
                                   aria-describedby={describedBy('phone', true)}
                                   className={cn(inputClass, 'pl-[4.75rem] tabular')}
                              />
                         </div>
                    </Field>

                    <Field
                         id={ids.password}
                         label={t.password}
                         hint={t.passwordHint}
                         error={msg('password')}
                    >
                         <div className="relative">
                              <input
                                   id={ids.password}
                                   name="password"
                                   type={showPassword ? 'text' : 'password'}
                                   autoComplete="new-password"
                                   required
                                   minLength={PASSWORD_MIN}
                                   value={values.password}
                                   onChange={(e) => update('password', e.target.value)}
                                   aria-invalid={!!errors.password || undefined}
                                   aria-describedby={describedBy('password', true)}
                                   className={cn(inputClass, 'pr-12')}
                              />
                              <button
                                   type="button"
                                   onClick={() => setShowPassword((s) => !s)}
                                   aria-label={showPassword ? t.hidePassword : t.showPassword}
                                   aria-pressed={showPassword}
                                   aria-controls={ids.password}
                                   className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-[11px] text-ink-3 hover:text-ink"
                              >
                                   {showPassword ? (
                                        <EyeOff className="size-[18px]" />
                                   ) : (
                                        <Eye className="size-[18px]" />
                                   )}
                              </button>
                         </div>
                    </Field>

                    <div>
                         <label
                              htmlFor={ids.terms}
                              className="flex cursor-pointer items-start gap-3 py-1 text-sm text-ink-2"
                         >
                              <input
                                   id={ids.terms}
                                   name="terms"
                                   type="checkbox"
                                   checked={values.terms}
                                   onChange={(e) => update('terms', e.target.checked)}
                                   aria-invalid={!!errors.terms || undefined}
                                   aria-describedby={
                                        errors.terms ? `${ids.terms}-error` : undefined
                                   }
                                   className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-brand-700"
                              />
                              <span>
                                   {t.termsBefore}{' '}
                                   <Link
                                        href="/terms"
                                        target="_blank"
                                        className="font-medium text-brand-700 underline-offset-2 hover:underline"
                                   >
                                        {t.terms}
                                   </Link>{' '}
                                   {t.termsAnd}{' '}
                                   <Link
                                        href="/privacy"
                                        target="_blank"
                                        className="font-medium text-brand-700 underline-offset-2 hover:underline"
                                   >
                                        {t.privacy}
                                   </Link>
                                   {t.termsAfter}
                              </span>
                         </label>
                         {errors.terms && (
                              <p
                                   id={`${ids.terms}-error`}
                                   className="mt-1 flex items-start gap-1.5 pl-8 text-xs text-error"
                              >
                                   <AlertCircle aria-hidden className="mt-px size-3.5 shrink-0" />
                                   {msg('terms')}
                              </p>
                         )}
                    </div>
               </div>

               {/* Primary action anchored at the bottom of the card — thumb zone on mobile (guide p.23) */}
               <div className="mt-auto pt-8">
                    <button
                         type="submit"
                         disabled={pending}
                         className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-[0.9375rem] font-semibold text-white transition-colors duration-[120ms] outline-none hover:bg-brand-800 focus-visible:ring-3 focus-visible:ring-brand-300 disabled:cursor-wait disabled:opacity-80"
                    >
                         {pending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
                         {pending ? t.submitting : t.submit}
                    </button>
                    <p className="mt-4 text-center text-sm text-ink-2">
                         {t.haveAccount}{' '}
                         <Link
                              href={loginHref}
                              className="font-semibold text-brand-700 hover:underline"
                         >
                              {t.login}
                         </Link>
                    </p>
               </div>
          </form>
     )
}
