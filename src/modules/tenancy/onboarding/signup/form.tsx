'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { useTranslations } from '@/i18n/client'
import { Turnstile } from '@/shared/components/security/turnstile'
import { useCaptcha } from '@/shared/components/security/use-captcha'
import { formValues } from '@/shared/lib/validation'
import { cn } from '@/shared/lib/utils'

import type { GoogleErrorCode } from '../../auth/google/config'
import {
     Field,
     FormAlert,
     inputClass,
     PasswordInput,
     RequiredMark,
     SubmitButton,
     useActionForm,
} from '@/shared/components/form'

import { SocialSignIn } from '../../shared/social-sign-in'
import { validate } from '../errors'
import { signupAction } from './actions'
import { NAME_MAX, PASSWORD_MIN, signupSchema, type SignupField } from './schema'

const FIELDS: SignupField[] = ['name', 'email', 'phone', 'password', 'terms']

/** Step 1 · Create your account (guide p.23, first screen). */
export function SignupForm({
     loginHref,
     googleHref,
     oauthError,
}: {
     loginHref: string
     /** Link to /auth/google, or null when Google sign-in isn't configured */
     googleHref?: string | null
     /** `?error=` sent back by the Google callback */
     oauthError?: GoogleErrorCode
}) {
     const { m, locale } = useTranslations('onboarding')
     const copy = m.signup
     const auth = useTranslations('auth').m
     const captcha = useCaptcha()
     // Kept for the "Log in →" link shown when the email is already registered
     const [email, setEmail] = useState('')

     const form = useActionForm({
          action: signupAction,
          validate: (data) => validate(signupSchema, formValues(data)),
          fields: FIELDS,
          beforeSubmit: captcha.ensure,
          onResponse: captcha.reset,
     })
     const { errors, state } = form

     const msg = (field: SignupField) => (errors[field] ? m.errors[errors[field]] : undefined)
     const alert = captcha.missing
          ? m.errors.captcha
          : form.hasErrors
            ? copy.errorSummary
            : state.formError
              ? m.errors[state.formError]
              : oauthError && state.status === 'idle'
                ? auth.googleErrors[oauthError]
                : undefined

     return (
          <form {...form.formProps} className="flex flex-1 flex-col">
               <SocialSignIn
                    id={`${form.id('name')}-social`}
                    copy={auth.social}
                    googleHref={googleHref}
                    showTerms
               />

               <FormAlert message={alert} />

               <div className="space-y-4">
                    <Field id={form.id('name')} label={copy.name} error={msg('name')} required>
                         <input
                              {...form.fieldProps('name')}
                              autoComplete="name"
                              required
                              maxLength={NAME_MAX}
                              placeholder={copy.namePlaceholder}
                              onChange={() => form.clearError('name')}
                              className={inputClass}
                         />
                    </Field>

                    <Field id={form.id('email')} label={copy.email} error={msg('email')} required>
                         <input
                              {...form.fieldProps('email')}
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              autoCapitalize="none"
                              spellCheck={false}
                              required
                              placeholder={copy.emailPlaceholder}
                              value={email}
                              onChange={(e) => {
                                   setEmail(e.target.value)
                                   form.clearError('email')
                              }}
                              className={inputClass}
                         />
                         {errors.email === 'emailTaken' && (
                              <Link
                                   href={`${loginHref}?email=${encodeURIComponent(email.trim())}`}
                                   className="mt-1 inline-block text-xs font-semibold text-brand-700 hover:underline"
                              >
                                   {copy.login} →
                              </Link>
                         )}
                    </Field>

                    <Field
                         id={form.id('phone')}
                         label={copy.phone}
                         hint={copy.phoneHint}
                         error={msg('phone')}
                         required
                    >
                         <div className="relative">
                              <span
                                   aria-hidden
                                   className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-line pr-3 pl-3.5 text-[0.9375rem] text-ink-2 tabular"
                              >
                                   +855
                              </span>
                              <input
                                   {...form.fieldProps('phone', { hint: true })}
                                   type="tel"
                                   inputMode="tel"
                                   autoComplete="tel-national"
                                   required
                                   placeholder="12 345 678"
                                   onChange={() => form.clearError('phone')}
                                   className={cn(inputClass, 'pl-[4.75rem] tabular')}
                              />
                         </div>
                    </Field>

                    <Field
                         id={form.id('password')}
                         label={copy.password}
                         hint={copy.passwordHint}
                         error={msg('password')}
                         required
                    >
                         <PasswordInput
                              {...form.fieldProps('password', { hint: true })}
                              autoComplete="new-password"
                              required
                              minLength={PASSWORD_MIN}
                              onChange={() => form.clearError('password')}
                              showLabel={auth.password.show}
                              hideLabel={auth.password.hide}
                         />
                    </Field>

                    <div>
                         <label
                              htmlFor={form.id('terms')}
                              className="flex cursor-pointer items-start gap-3 py-1 text-sm text-ink-2"
                         >
                              <input
                                   {...form.fieldProps('terms')}
                                   type="checkbox"
                                   required
                                   onChange={() => form.clearError('terms')}
                                   className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-brand-700"
                              />
                              <span>
                                   {copy.termsBefore}{' '}
                                   <Link
                                        href="/terms"
                                        target="_blank"
                                        className="font-medium text-brand-700 underline-offset-2 hover:underline"
                                   >
                                        {copy.terms}
                                   </Link>{' '}
                                   {copy.termsAnd}{' '}
                                   <Link
                                        href="/privacy"
                                        target="_blank"
                                        className="font-medium text-brand-700 underline-offset-2 hover:underline"
                                   >
                                        {copy.privacy}
                                   </Link>
                                   {copy.termsAfter}
                                   <RequiredMark />
                              </span>
                         </label>
                         {errors.terms && (
                              <p
                                   id={`${form.id('terms')}-error`}
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
                    <Turnstile
                         action="signup"
                         locale={locale}
                         {...captcha.widget}
                         className="mb-4"
                    />
                    <SubmitButton
                         pending={form.pending}
                         disabled={!form.ready}
                         label={copy.submit}
                         pendingLabel={copy.submitting}
                    />
                    <p className="mt-4 text-center text-sm text-ink-2">
                         {copy.haveAccount}{' '}
                         <Link
                              href={loginHref}
                              className="font-semibold text-brand-700 hover:underline"
                         >
                              {copy.login}
                         </Link>
                    </p>
               </div>
          </form>
     )
}
