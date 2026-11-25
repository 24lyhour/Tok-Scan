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

import {
     Field,
     FormAlert,
     GoogleSignIn,
     inputClass,
     PasswordInput,
     SubmitButton,
} from '../../shared/form'
import { loginAction, type LoginState } from '../actions'
import { type LoginErrorCode, type LoginField, validateLogin } from '../validation'

type Errors = Partial<Record<LoginField, LoginErrorCode>>

export function LoginForm({
     next,
     defaultEmail = '',
     signupHref,
     forgotHref,
}: {
     /** Where to go after logging in (validated again on the server) */
     next?: string
     defaultEmail?: string
     signupHref: string
     forgotHref: string
}) {
     const t = useTranslations('auth').m.login
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
     const passwordRef = useRef<HTMLInputElement>(null)

     // Server said "wrong email or password": clear the password and put the cursor back in it
     useEffect(() => {
          if (state.status !== 'error') return
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
          const data = new FormData(e.currentTarget)
          startTransition(() => dispatch(data))
     }

     const msg = (field: LoginField) => (errors[field] ? t.errors[errors[field]!] : undefined)
     const hasFieldErrors = Object.values(errors).some(Boolean)
     const alert = !hasFieldErrors && state.formError ? t.errors[state.formError] : undefined

     return (
          <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col">
               {next && <input type="hidden" name="next" value={next} />}

               <GoogleSignIn
                    id={`${uid}-google`}
                    label={t.google}
                    soonLabel={t.googleSoon}
                    orLabel={t.or}
               />

               <FormAlert message={alert} />

               <div className="space-y-4">
                    <Field id={ids.email} label={t.email} error={msg('email')}>
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
                              placeholder={t.emailPlaceholder}
                              value={values.email}
                              onChange={(e) => update('email', e.target.value)}
                              aria-invalid={!!errors.email || undefined}
                              aria-describedby={errors.email ? `${ids.email}-error` : undefined}
                              className={inputClass}
                         />
                    </Field>

                    <Field
                         id={ids.password}
                         label={t.password}
                         error={msg('password')}
                         labelAction={
                              <Link
                                   href={forgotHref}
                                   className="text-xs font-semibold text-brand-700 hover:underline"
                              >
                                   {t.forgot}
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
                              showLabel={t.showPassword}
                              hideLabel={t.hidePassword}
                         />
                    </Field>
               </div>

               <div className="mt-auto pt-8">
                    <SubmitButton pending={pending} label={t.submit} pendingLabel={t.submitting} />
                    <p className="mt-4 text-center text-sm text-ink-2">
                         {t.noAccount}{' '}
                         <Link
                              href={signupHref}
                              className="font-semibold text-brand-700 hover:underline"
                         >
                              {t.startTrial}
                         </Link>
                    </p>
               </div>
          </form>
     )
}
