'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'

import { useTranslations } from '@/i18n/client'
import { Turnstile } from '@/shared/components/security/turnstile'
import { useCaptcha } from '@/shared/components/security/use-captcha'
import { formValues } from '@/shared/lib/validation'

import {
     Field,
     FormAlert,
     inputClass,
     PasswordInput,
     SubmitButton,
     useActionForm,
} from '@/shared/components/form'

import { SocialSignIn } from '../../shared/social-sign-in'
import { validate } from '../errors'
import type { GoogleErrorCode } from '../google/config'
import { loginAction } from './actions'
import { type LoginField, loginSchema } from './schema'

const FIELDS: LoginField[] = ['email', 'password']

export function LoginForm({
     next,
     defaultEmail = '',
     signupHref,
     forgotHref,
     googleHref,
     oauthError,
     staff = false,
}: {
     /** Where to go after logging in (validated again on the server) */
     next?: string
     defaultEmail?: string
     signupHref: string
     forgotHref: string
     /** Link to /auth/google, or null when Google sign-in isn't configured */
     googleHref?: string | null
     /** `?error=` sent back by the Google callback */
     oauthError?: GoogleErrorCode
     /** tok-scan staff (console) login: email + password only, no sign-up link */
     staff?: boolean
}) {
     const { m, locale } = useTranslations('auth')
     const copy = m.login
     const captcha = useCaptcha()
     const [password, setPassword] = useState('')
     const passwordRef = useRef<HTMLInputElement>(null)

     const form = useActionForm({
          action: loginAction,
          validate: (data) => validate(loginSchema, formValues(data)),
          fields: FIELDS,
          beforeSubmit: captcha.ensure,
          onResponse: (state) => {
               captcha.reset()
               // "Wrong email or password": clear the password and put the cursor back in it
               if (state.formError === 'invalidCredentials') {
                    setPassword('')
                    passwordRef.current?.focus()
               }
          },
     })
     const { errors, state } = form

     const msg = (field: LoginField) => (errors[field] ? m.errors[errors[field]] : undefined)
     const alert = captcha.missing
          ? m.errors.captcha
          : !form.hasErrors && state.formError
            ? m.errors[state.formError]
            : oauthError && state.status === 'idle'
              ? m.googleErrors[oauthError]
              : undefined

     return (
          <form {...form.formProps} className="flex flex-1 flex-col">
               {next && <input type="hidden" name="next" value={next} />}

               {!staff && (
                    <SocialSignIn
                         id={form.id('email') + '-social'}
                         copy={m.social}
                         googleHref={googleHref}
                    />
               )}

               <FormAlert message={alert} />

               <div className="space-y-4">
                    <Field id={form.id('email')} label={copy.email} error={msg('email')} required>
                         <input
                              {...form.fieldProps('email')}
                              type="email"
                              inputMode="email"
                              autoComplete="username"
                              autoCapitalize="none"
                              spellCheck={false}
                              autoFocus={!defaultEmail}
                              required
                              placeholder={copy.emailPlaceholder}
                              defaultValue={defaultEmail}
                              onChange={() => form.clearError('email')}
                              className={inputClass}
                         />
                    </Field>

                    <Field
                         id={form.id('password')}
                         label={copy.password}
                         error={msg('password')}
                         required
                         labelAction={
                              <Link
                                   href={forgotHref}
                                   className="text-xs font-semibold text-brand-700 hover:underline"
                              >
                                   {copy.forgot}
                              </Link>
                         }
                    >
                         <PasswordInput
                              {...form.fieldProps('password')}
                              ref={passwordRef}
                              autoComplete="current-password"
                              autoFocus={!!defaultEmail}
                              required
                              value={password}
                              onChange={(e) => {
                                   setPassword(e.target.value)
                                   form.clearError('password')
                              }}
                              aria-invalid={
                                   !!errors.password ||
                                   state.formError === 'invalidCredentials' ||
                                   undefined
                              }
                              showLabel={m.password.show}
                              hideLabel={m.password.hide}
                         />
                    </Field>
               </div>

               <div className="mt-auto pt-8">
                    <Turnstile
                         action="login"
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
                    {!staff && (
                         <p className="mt-4 text-center text-sm text-ink-2">
                              {copy.noAccount}{' '}
                              <Link
                                   href={signupHref}
                                   className="font-semibold text-brand-700 hover:underline"
                              >
                                   {copy.startTrial}
                              </Link>
                         </p>
                    )}
               </div>
          </form>
     )
}
