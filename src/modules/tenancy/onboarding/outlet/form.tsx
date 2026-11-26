'use client'

import { useState } from 'react'

import { useTranslations } from '@/i18n/client'
import {
     ChoiceChips,
     Field,
     FormAlert,
     inputClass,
     SubmitButton,
     TimeSelect,
     Toggle,
     useActionForm,
} from '@/shared/components/form'
import { formValues } from '@/shared/lib/validation'
import { cn } from '@/shared/lib/utils'

import {
     OUTLET_DEFAULTS,
     OUTLET_LIMITS,
     WEEKDAYS,
     type Weekday,
} from '../../collections/outlets/constants'
import { validate } from '../errors'
import { saveOutlet } from './actions'
import { OUTLET_LIST_FIELDS, type OutletField, outletSchema } from './schema'

const FIELDS: OutletField[] = [
     'name',
     'address',
     'exchangeRate',
     'vatPercent',
     'serviceChargePercent',
     'lightingTaxPercent',
     'vatTin',
     'days',
     'opens',
     'closes',
]

export type OutletFormValues = typeof OUTLET_DEFAULTS & {
     name: string
     address: string
     vatTin: string
}

/** Everything else is required */
const OPTIONAL_FIELDS: OutletField[] = ['address', 'vatTin']

/** The three taxes: [enabled field, percent field, label key, hint key] */
const TAXES = [
     ['vatEnabled', 'vatPercent', 'vat', 'vatHint'],
     ['serviceChargeEnabled', 'serviceChargePercent', 'service', 'serviceHint'],
     ['lightingTaxEnabled', 'lightingTaxPercent', 'lighting', 'lightingHint'],
] as const

/** Step 3 · Your first outlet (guide p.23, third screen). */
export function OutletForm({ initial }: { initial: OutletFormValues }) {
     const { m, locale } = useTranslations('onboarding')
     const common = useTranslations('common').m
     const copy = m.outlet

     const form = useActionForm({
          action: saveOutlet,
          validate: (data) => validate(outletSchema, formValues(data, OUTLET_LIST_FIELDS)),
          fields: FIELDS,
     })
     const { errors, state } = form

     const [enabled, setEnabled] = useState({
          vatEnabled: initial.vatEnabled,
          serviceChargeEnabled: initial.serviceChargeEnabled,
          lightingTaxEnabled: initial.lightingTaxEnabled,
     })
     const [days, setDays] = useState<Weekday[]>(initial.days)
     const [hours, setHours] = useState({ opens: initial.opens, closes: initial.closes })
     // Closing at or before opening time = after midnight (e.g. a bar open 18:00 → 02:00)
     const overnight = hours.closes <= hours.opens

     const msg = (field: OutletField) => (errors[field] ? m.errors[errors[field]] : undefined)
     /** Plain text/number input with the hook's id/name/aria props */
     const input = (field: OutletField, extra: React.ComponentProps<'input'> = {}) => (
          <input
               {...form.fieldProps(field)}
               required={!OPTIONAL_FIELDS.includes(field)}
               defaultValue={String(initial[field as keyof OutletFormValues] ?? '')}
               onChange={() => form.clearError(field)}
               {...extra}
               className={cn(inputClass, extra.className)}
          />
     )

     return (
          <form {...form.formProps} className="flex flex-1 flex-col">
               <FormAlert message={state.formError ? m.errors[state.formError] : undefined} />

               <div className="space-y-5">
                    <Field id={form.id('name')} label={copy.name} error={msg('name')} required>
                         {input('name', {
                              maxLength: OUTLET_LIMITS.name,
                              placeholder: copy.namePlaceholder,
                         })}
                    </Field>

                    <Field id={form.id('address')} label={copy.address} error={msg('address')}>
                         {input('address', {
                              autoComplete: 'street-address',
                              maxLength: OUTLET_LIMITS.address,
                              placeholder: copy.addressPlaceholder,
                         })}
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                         <div>
                              <p className="mb-1.5 text-sm font-medium text-ink">{copy.currency}</p>
                              <p className="flex h-12 items-center rounded-[11px] border border-line bg-paper px-3.5 text-[0.9375rem] font-medium text-ink">
                                   {copy.currencyValue}
                              </p>
                         </div>
                         <Field
                              id={form.id('exchangeRate')}
                              label={copy.rate}
                              hint={copy.rateHint}
                              error={msg('exchangeRate')}
                              required
                         >
                              {input('exchangeRate', {
                                   inputMode: 'numeric',
                                   className: 'tabular',
                              })}
                         </Field>
                    </div>

                    <div className="divide-y divide-line rounded-[14px] border border-line bg-paper/50">
                         {TAXES.map(([toggle, percent, label, hint]) => (
                              <div key={toggle} className="px-4 py-3">
                                   <div className="flex items-center gap-3">
                                        <label
                                             htmlFor={form.id(percent)}
                                             className="min-w-0 flex-1"
                                        >
                                             <span className="block text-sm font-medium text-ink">
                                                  {copy[label]}
                                             </span>
                                             {copy[hint] && (
                                                  <span className="block text-xs text-ink-3">
                                                       {copy[hint]}
                                                  </span>
                                             )}
                                        </label>
                                        <div
                                             className={cn(
                                                  'relative w-20',
                                                  !enabled[toggle] && 'opacity-50',
                                             )}
                                        >
                                             {input(percent, {
                                                  inputMode: 'decimal',
                                                  className: 'h-10 pr-7 text-right tabular',
                                             })}
                                             <span
                                                  aria-hidden
                                                  className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-3"
                                             >
                                                  %
                                             </span>
                                        </div>
                                        <Toggle
                                             name={toggle}
                                             label={copy[label]}
                                             checked={enabled[toggle]}
                                             onChange={(on) =>
                                                  setEnabled((e) => ({ ...e, [toggle]: on }))
                                             }
                                        />
                                   </div>
                                   {errors[percent] && (
                                        <p className="mt-1 text-xs text-error">{msg(percent)}</p>
                                   )}
                              </div>
                         ))}
                    </div>

                    <Field
                         id={form.id('vatTin')}
                         label={copy.vatTin}
                         hint={copy.vatTinHint}
                         error={msg('vatTin')}
                    >
                         {input('vatTin', {
                              maxLength: OUTLET_LIMITS.vatTin,
                              placeholder: copy.vatTinPlaceholder,
                         })}
                    </Field>

                    <Field id={form.id('days')} label={copy.hours} error={msg('days')} required>
                         <ChoiceChips
                              multiple
                              id={form.id('days')}
                              name="days"
                              required
                              label={copy.hours}
                              options={WEEKDAYS.map((d) => ({ value: d, label: copy.days[d] }))}
                              value={days}
                              onChange={(next) => {
                                   setDays(next)
                                   form.clearError('days')
                              }}
                              invalid={Boolean(errors.days)}
                         />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                         <Field
                              id={form.id('opens')}
                              label={copy.opens}
                              error={msg('opens')}
                              required
                         >
                              <TimeSelect
                                   id={form.id('opens')}
                                   name="opens"
                                   label={copy.opens}
                                   value={hours.opens}
                                   onChange={(opens) => {
                                        setHours((h) => ({ ...h, opens }))
                                        form.clearError('opens')
                                   }}
                                   locale={locale}
                                   invalid={Boolean(errors.opens)}
                                   required
                              />
                         </Field>
                         <Field
                              id={form.id('closes')}
                              label={copy.closes}
                              error={msg('closes')}
                              required
                         >
                              <TimeSelect
                                   id={form.id('closes')}
                                   name="closes"
                                   label={copy.closes}
                                   value={hours.closes}
                                   onChange={(closes) => {
                                        setHours((h) => ({ ...h, closes }))
                                        form.clearError('closes')
                                   }}
                                   locale={locale}
                                   note={overnight ? copy.nextDay : undefined}
                                   invalid={Boolean(errors.closes)}
                                   required
                              />
                         </Field>
                    </div>
               </div>

               <div className="mt-auto pt-8">
                    <SubmitButton
                         pending={form.pending}
                         disabled={!form.ready}
                         label={copy.submit}
                         pendingLabel={common.states.saving}
                    />
               </div>
          </form>
     )
}
