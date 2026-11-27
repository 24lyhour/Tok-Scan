'use client'

import Link from 'next/link'

import { useTranslations } from '@/i18n/client'
import { Field, FormAlert, inputClass, SubmitButton, useActionForm } from '@/shared/components/form'
import { Turnstile } from '@/shared/components/security/turnstile'
import { useCaptcha } from '@/shared/components/security/use-captcha'
import { formValues } from '@/shared/lib/validation'

import { validate } from '../errors'
import { requestResetAction } from './actions'
import { type ForgotField, forgotSchema } from './schema'

const FIELDS: ForgotField[] = ['email']

/** Step 1 · enter your email → we send a reset link. */
export function ForgotForm({
     loginHref,
     defaultEmail = '',
}: {
     loginHref: string
     defaultEmail?: string
}) {
     const { m, locale } = useTranslations('auth')
     const copy = m.forgot
     const captcha = useCaptcha()

     const form = useActionForm({
          action: requestResetAction,
          validate: (data) => validate(forgotSchema, formValues(data)),
          fields: FIELDS,
          beforeSubmit: captcha.ensure,
          onResponse: () => captcha.reset(),
     })
     const { errors, state } = form
     const alert = captcha.missing
          ? m.errors.captcha
          : !form.hasErrors && state.formError
            ? m.errors[state.formError]
            : undefined

     return (
          <form {...form.formProps} className="flex flex-1 flex-col">
               <FormAlert message={alert} />
               <Field
                    id={form.id('email')}
                    label={copy.email}
                    error={errors.email ? m.errors[errors.email] : undefined}
                    required
               >
                    <input
                         {...form.fieldProps('email')}
                         type="email"
                         inputMode="email"
                         autoComplete="username"
                         autoCapitalize="none"
                         spellCheck={false}
                         autoFocus
                         required
                         placeholder={copy.emailPlaceholder}
                         defaultValue={defaultEmail}
                         onChange={() => form.clearError('email')}
                         className={inputClass}
                    />
               </Field>

               <div className="mt-auto pt-8">
                    <Turnstile
                         action="reset"
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
                    <p className="mt-4 text-center text-sm">
                         <Link
                              href={loginHref}
                              className="font-semibold text-brand-700 hover:underline"
                         >
                              {copy.back}
                         </Link>
                    </p>
               </div>
          </form>
     )
}
