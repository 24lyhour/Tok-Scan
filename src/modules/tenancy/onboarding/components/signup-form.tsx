'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useEffect, useId, useState, useTransition, type FormEvent } from 'react'

import { useTranslations } from '@/i18n/client'
import { cn } from '@/shared/lib/utils'

import {
     Field,
     FormAlert,
     GoogleSignIn,
     inputClass,
     PasswordInput,
     SubmitButton,
} from '../../shared/form'
import { signupAction, type SignupState } from '../actions'
import { PASSWORD_MIN, type SignupErrorCode, type SignupField, validateSignup } from '../validation'

type Errors = Partial<Record<SignupField, SignupErrorCode>>

const FIELD_ORDER: SignupField[] = ['name', 'email', 'phone', 'password', 'terms']

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
     const [state, dispatch, pending] = useActionState<SignupState, FormData>(signupAction, {
          status: 'idle',
     })
     const [, startTransition] = useTransition()

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
     const alert = hasErrors
          ? t.errorSummary
          : state.formError
            ? t.errors[state.formError]
            : undefined

     return (
          <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col">
               <GoogleSignIn
                    id={`${uid}-google`}
                    label={t.google}
                    soonLabel={t.googleSoon}
                    orLabel={t.or}
               />

               <FormAlert message={alert} />

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
                                   href={`${loginHref}?email=${encodeURIComponent(values.email.trim())}`}
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
                         <PasswordInput
                              id={ids.password}
                              name="password"
                              autoComplete="new-password"
                              required
                              minLength={PASSWORD_MIN}
                              value={values.password}
                              onChange={(e) => update('password', e.target.value)}
                              aria-invalid={!!errors.password || undefined}
                              aria-describedby={describedBy('password', true)}
                              showLabel={t.showPassword}
                              hideLabel={t.hidePassword}
                         />
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
                    <SubmitButton pending={pending} label={t.submit} pendingLabel={t.submitting} />
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
