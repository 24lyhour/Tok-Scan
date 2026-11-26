'use client'

import Link from 'next/link'
import {
     useActionState,
     useEffect,
     useId,
     useRef,
     useState,
     useTransition,
     type FormEvent,
} from 'react'

import { useTranslations } from '@/i18n/client'
import { Turnstile } from '@/shared/components/security/turnstile'

import {
     Field,
     FormAlert,
     SocialSignIn,
     inputClass,
     PasswordInput,
     SubmitButton,
} from '../../shared/form'
import { loginAction, type LoginState } from '../actions'
import type { GoogleErrorCode } from '../google/config'
import { type LoginErrorCode, type LoginField, validateLogin } from '../validation'

type Errors = Partial<Record<LoginField, LoginErrorCode>>

export function LoginForm({
     next,
     defaultEmail = '',
     signupHref,
     forgotHref,
     googleHref,
     oauthError,
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
}) {
     const { m, locale } = useTranslations('auth')
     const copy = m.login
     const uid = useId()
     const ids = { email: `${uid}-email`, password: `${uid}-password` } satisfies Record<
          LoginField,
          string
     >

     const [values, setValues] = useState({ email: defaultEmail, password: '' })
     const [errors, setErrors] = useState<Errors>({})
     const [state, dispatch, pending] = useActionState<LoginState, FormData>(loginAction, {
          status: 'idle',
     })
     const [, startTransition] = useTransition()
     // Cloudflare Turnstile token (one-time use; refreshed after every server response)
     const [captchaToken, setCaptchaToken] = useState<string | null>(null)
     const [captchaReset, setCaptchaReset] = useState(0)
     const [captchaMissing, setCaptchaMissing] = useState(false)
     const onCaptchaToken = (token: string | null) => {
          setCaptchaToken(token)
          if (token) setCaptchaMissing(false)
     }
     const passwordRef = useRef<HTMLInputElement>(null)

     // Server said "wrong email or password": clear the password and put the cursor back in it
     useEffect(() => {
          if (state.status !== 'error') return
          setCaptchaReset((k) => k + 1)
          if (state.fieldErrors) {
               setErrors(state.fieldErrors)
               return
          }
          if (state.formError === 'invalidCredentials') {
               setValues((v) => ({ ...v, password: '' }))
               passwordRef.current?.focus()
          }
     }, [state])

     const update = (key: LoginField, value: string) => {
          setValues((v) => ({ ...v, [key]: value }))
          if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
     }

     const onSubmit = (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const check = validateLogin(values)
          if (!check.ok) {
               setErrors(check.fieldErrors)
               document.getElementById(ids[check.fieldErrors.email ? 'email' : 'password'])?.focus()
               return
          }
          setErrors({})
          if (!captchaToken) {
               setCaptchaMissing(true)
               return
          }
          const data = new FormData(e.currentTarget)
          startTransition(() => dispatch(data))
     }

     const msg = (field: LoginField) => (errors[field] ? copy.errors[errors[field]!] : undefined)
     const hasFieldErrors = Object.values(errors).some(Boolean)
     const alert = captchaMissing
          ? copy.errors.captcha
          : !hasFieldErrors && state.formError
            ? copy.errors[state.formError]
            : oauthError && state.status === 'idle'
              ? copy.googleErrors[oauthError]
              : undefined

     return (
          <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col">
               {next && <input type="hidden" name="next" value={next} />}

               <SocialSignIn
                    id={`${uid}-social`}
                    appleLabel={copy.apple}
                    googleLabel={copy.google}
                    googleHref={googleHref}
                    soonLabel={copy.socialSoon}
                    appleSoonLabel={copy.appleSoon}
                    orLabel={copy.or}
               />

               <FormAlert message={alert} />

               <div className="space-y-4">
                    <Field id={ids.email} label={copy.email} error={msg('email')}>
                         <input
                              id={ids.email}
                              name="email"
                              type="email"
                              inputMode="email"
                              autoComplete="username"
                              autoCapitalize="none"
                              spellCheck={false}
                              autoFocus={!defaultEmail}
                              required
                              placeholder={copy.emailPlaceholder}
                              value={values.email}
                              onChange={(e) => update('email', e.target.value)}
                              aria-invalid={!!errors.email || undefined}
                              aria-describedby={errors.email ? `${ids.email}-error` : undefined}
                              className={inputClass}
                         />
                    </Field>

                    <Field
                         id={ids.password}
                         label={copy.password}
                         error={msg('password')}
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
                              ref={passwordRef}
                              id={ids.password}
                              name="password"
                              autoComplete="current-password"
                              autoFocus={!!defaultEmail}
                              required
                              value={values.password}
                              onChange={(e) => update('password', e.target.value)}
                              aria-invalid={
                                   !!errors.password ||
                                   state.formError === 'invalidCredentials' ||
                                   undefined
                              }
                              aria-describedby={
                                   errors.password ? `${ids.password}-error` : undefined
                              }
                              showLabel={copy.showPassword}
                              hideLabel={copy.hidePassword}
                         />
                    </Field>
               </div>

               <div className="mt-auto pt-8">
                    <Turnstile
                         action="login"
                         locale={locale}
                         resetKey={captchaReset}
                         onToken={onCaptchaToken}
                         className="mb-4"
                    />
                    <SubmitButton
                         pending={pending}
                         label={copy.submit}
                         pendingLabel={copy.submitting}
                    />
                    <p className="mt-4 text-center text-sm text-ink-2">
                         {copy.noAccount}{' '}
                         <Link
                              href={signupHref}
                              className="font-semibold text-brand-700 hover:underline"
                         >
                              {copy.startTrial}
                         </Link>
                    </p>
               </div>
          </form>
     )
}
