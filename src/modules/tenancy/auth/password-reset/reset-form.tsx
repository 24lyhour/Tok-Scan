'use client'

import Link from 'next/link'
import { useState } from 'react'

import { useTranslations } from '@/i18n/client'
import {
     Field,
     FormAlert,
     PasswordInput,
     SubmitButton,
     useActionForm,
} from '@/shared/components/form'
import { formValues } from '@/shared/lib/validation'

import { validate } from '../errors'
import { resetPasswordAction } from './actions'
import { PASSWORD_MIN, type ResetField, resetSchema } from './schema'

const FIELDS: ResetField[] = ['password', 'confirm']

/** Step 2 · the page the email link opens: choose a new password (then you're signed in). */
export function ResetForm({ token, forgotHref }: { token: string; forgotHref: string }) {
     const { m } = useTranslations('auth')
     const copy = m.reset
     const [password, setPassword] = useState('')
     const [confirm, setConfirm] = useState('')

     const form = useActionForm({
          action: resetPasswordAction,
          validate: (data) => validate(resetSchema, formValues(data)),
          fields: FIELDS,
     })
     const { errors, state } = form
     const msg = (field: ResetField) => (errors[field] ? m.errors[errors[field]] : undefined)
     const expired = !form.hasErrors && state.formError === 'tokenInvalid'

     return (
          <form {...form.formProps} className="flex flex-1 flex-col">
               <input type="hidden" name="token" value={token} />
               <FormAlert
                    message={
                         !form.hasErrors && state.formError ? m.errors[state.formError] : undefined
                    }
               />
               {expired && (
                    <p className="-mt-2 mb-4 text-sm">
                         <Link
                              href={forgotHref}
                              className="font-semibold text-brand-700 hover:underline"
                         >
                              {copy.requestNew}
                         </Link>
                    </p>
               )}

               <div className="space-y-4">
                    <Field
                         id={form.id('password')}
                         label={copy.password}
                         hint={copy.passwordHint}
                         error={msg('password')}
                         required
                    >
                         <PasswordInput
                              {...form.fieldProps('password')}
                              autoComplete="new-password"
                              autoFocus
                              required
                              minLength={PASSWORD_MIN}
                              value={password}
                              onChange={(e) => {
                                   setPassword(e.target.value)
                                   form.clearError('password')
                              }}
                              showLabel={m.password.show}
                              hideLabel={m.password.hide}
                         />
                    </Field>
                    <Field
                         id={form.id('confirm')}
                         label={copy.confirm}
                         error={msg('confirm')}
                         required
                    >
                         <PasswordInput
                              {...form.fieldProps('confirm')}
                              autoComplete="new-password"
                              required
                              value={confirm}
                              onChange={(e) => {
                                   setConfirm(e.target.value)
                                   form.clearError('confirm')
                              }}
                              showLabel={m.password.show}
                              hideLabel={m.password.hide}
                         />
                    </Field>
               </div>

               <div className="mt-auto pt-8">
                    <SubmitButton
                         pending={form.pending}
                         disabled={!form.ready}
                         label={copy.submit}
                         pendingLabel={copy.submitting}
                    />
               </div>
          </form>
     )
}
