'use client'

import Link from 'next/link'
import { type ReactNode, useState } from 'react'

import { useTranslations } from '@/i18n/client'
import {
     BUSINESS_TYPES,
     type BusinessType,
     NAME_MAX,
     ORGANIZATION_LIMITS,
} from '@/modules/tenancy/rules'
import {
     ChoiceChips,
     Field,
     FormAlert,
     inputClass,
     SubmitButton,
     useActionForm,
} from '@/shared/components/form'
import { formValues } from '@/shared/lib/validation'

import { updateOrganization } from './actions'
import { type OrgEditField, orgEditSchema, validateOrgEdit } from './schema'

const FIELDS: OrgEditField[] = [
     'name',
     'slug',
     'businessType',
     'businessTypeOther',
     'trialEndsAt',
     'ownerName',
     'ownerEmail',
]

export type OrgEditValues = {
     id: number
     name: string
     slug: string
     businessType: BusinessType
     businessTypeOther: string
     /** yyyy-mm-dd or '' */
     trialEndsAt: string
     ownerName: string
     ownerEmail: string
}

/** Console · Edit organization: the restaurant's basics and its owner's login email. */
export function OrgEditForm({
     initial,
     menuBase,
     cancelHref,
}: {
     initial: OrgEditValues
     /** "tok-scan.store/r/" — shown in front of the web address */
     menuBase: string
     cancelHref: string
}) {
     const copy = useTranslations('console').m.edit
     const onboarding = useTranslations('onboarding').m
     const labels = onboarding.organization
     const common = useTranslations('common').m

     const form = useActionForm({
          action: updateOrganization,
          validate: (data) => validateOrgEdit(orgEditSchema, formValues(data)),
          fields: FIELDS,
     })
     const { errors, state } = form
     const [businessType, setBusinessType] = useState<BusinessType>(initial.businessType)
     const msg = (field: OrgEditField) => {
          const code = errors[field]
          if (!code) return undefined
          // Onboarding's wording says "Log in instead" — staff need their own
          return code === 'emailTaken' ? copy.emailTaken : onboarding.errors[code]
     }
     // Plain text inputs: the error clears as soon as the field is edited
     const text = (field: OrgEditField) => ({
          ...form.fieldProps(field),
          onChange: () => form.clearError(field),
          className: inputClass,
     })

     return (
          <form {...form.formProps} className="space-y-4">
               <input type="hidden" name="id" value={initial.id} />
               <FormAlert
                    message={
                         !form.hasErrors && state.formError
                              ? onboarding.errors[state.formError]
                              : undefined
                    }
               />

               <Section title={copy.organization}>
                    <Field id={form.id('name')} label={labels.name} error={msg('name')} required>
                         <input
                              {...text('name')}
                              required
                              maxLength={ORGANIZATION_LIMITS.name}
                              defaultValue={initial.name}
                         />
                    </Field>

                    <Field
                         id={form.id('slug')}
                         label={labels.slug}
                         hint={copy.slugHint}
                         error={msg('slug')}
                         required
                    >
                         <div className="flex h-12 items-center rounded-[11px] border border-line bg-white focus-within:border-brand-500 focus-within:ring-3 focus-within:ring-brand-500/15 has-aria-invalid:border-error">
                              <span className="pl-3.5 text-sm text-ink-3 select-none">
                                   {menuBase}
                              </span>
                              <input
                                   {...form.fieldProps('slug', { hint: true })}
                                   onChange={() => form.clearError('slug')}
                                   autoCapitalize="none"
                                   spellCheck={false}
                                   required
                                   defaultValue={initial.slug}
                                   className="h-full min-w-0 flex-1 bg-transparent pr-3.5 text-[0.9375rem] font-medium text-ink outline-none"
                              />
                         </div>
                    </Field>

                    <Field
                         id={form.id('businessType')}
                         label={labels.businessType}
                         error={msg('businessType')}
                         required
                    >
                         <ChoiceChips
                              id={form.id('businessType')}
                              name="businessType"
                              required
                              label={labels.businessType}
                              options={BUSINESS_TYPES.map((t) => ({
                                   value: t,
                                   label: labels.types[t],
                              }))}
                              value={businessType}
                              onChange={(t) => {
                                   setBusinessType(t)
                                   form.clearError('businessType')
                              }}
                              invalid={Boolean(errors.businessType)}
                         />
                    </Field>

                    {businessType === 'other' && (
                         <Field
                              id={form.id('businessTypeOther')}
                              label={labels.otherType}
                              error={msg('businessTypeOther')}
                              required
                         >
                              <input
                                   {...text('businessTypeOther')}
                                   required
                                   maxLength={ORGANIZATION_LIMITS.businessTypeOther}
                                   defaultValue={initial.businessTypeOther}
                              />
                         </Field>
                    )}

                    <Field
                         id={form.id('trialEndsAt')}
                         label={copy.trialEnds}
                         hint={copy.trialHint}
                         error={msg('trialEndsAt')}
                    >
                         <input
                              {...text('trialEndsAt')}
                              type="date"
                              defaultValue={initial.trialEndsAt}
                         />
                    </Field>
               </Section>

               <Section title={copy.owner}>
                    <Field
                         id={form.id('ownerName')}
                         label={copy.ownerName}
                         error={msg('ownerName')}
                         required
                    >
                         <input
                              {...text('ownerName')}
                              required
                              maxLength={NAME_MAX}
                              autoComplete="off"
                              defaultValue={initial.ownerName}
                         />
                    </Field>
                    <Field
                         id={form.id('ownerEmail')}
                         label={copy.ownerEmail}
                         hint={copy.ownerEmailHint}
                         error={msg('ownerEmail')}
                         required
                    >
                         <input
                              {...text('ownerEmail')}
                              type="email"
                              inputMode="email"
                              autoCapitalize="none"
                              autoComplete="off"
                              spellCheck={false}
                              required
                              defaultValue={initial.ownerEmail}
                         />
                    </Field>
               </Section>

               <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Link
                         href={cancelHref}
                         className="flex h-12 items-center justify-center rounded-xl border border-line bg-white px-6 text-[0.9375rem] font-semibold text-ink hover:bg-paper"
                    >
                         {common.actions.cancel}
                    </Link>
                    <div className="sm:w-48">
                         <SubmitButton
                              pending={form.pending}
                              disabled={!form.ready}
                              label={common.actions.saveChanges}
                              pendingLabel={common.states.saving}
                         />
                    </div>
               </div>
          </form>
     )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
     return (
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
               <h2 className="mb-5 text-base font-bold text-ink">{title}</h2>
               <div className="space-y-5">{children}</div>
          </section>
     )
}
