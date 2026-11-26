'use client'

import { useState, type ReactNode } from 'react'

import { buildTableQrUrl, QrCode, TABLE_LIMITS, tableLabel } from '@/modules/tables'
import { useTranslations } from '@/i18n/client'
import { interpolate, localizeDigits } from '@/shared/i18n/format'
import { formValues } from '@/shared/lib/validation'

import {
     Field,
     FormAlert,
     inputClass,
     Stepper,
     SubmitButton,
     useActionForm,
} from '@/shared/components/form'

import { validate } from '../errors'
import { saveTables } from './actions'
import { type TablesField, tablesSchema } from './schema'

const FIELDS: TablesField[] = ['zone', 'count']
/** How many QR previews to draw (the print sheet has all of them) */
const PREVIEW_MAX = 6

/** Step 4 · Tables & QR codes (guide p.23, fourth screen). */
export function TablesForm({
     maxTables,
     initial,
     qr,
     checklist,
     submitLabel,
     returnTo = 'dashboard',
}: {
     /** Plan limit for this outlet (free trial = Growth) */
     maxTables: number
     initial: { zone: string; count: number }
     /** For previews: public origin, organization slug, and saved QR keys by table number */
     qr: { origin: string; orgSlug: string; keys: Record<number, string> }
     /** Go-live checklist (onboarding only) */
     checklist?: ReactNode
     /** Button text (default: "Finish & open dashboard") */
     submitLabel?: string
     /** Where saving goes: onboarding → dashboard, app → back to Tables */
     returnTo?: 'dashboard' | 'tables'
}) {
     const { m, locale } = useTranslations('onboarding')
     const common = useTranslations('common').m
     const copy = m.tables

     const form = useActionForm({
          action: saveTables,
          validate: (data) => validate(tablesSchema, formValues(data)),
          fields: FIELDS,
     })
     const { errors, state } = form
     const [count, setCount] = useState(initial.count)

     const shown = Math.min(count, PREVIEW_MAX)
     const msg = (field: TablesField) => (errors[field] ? m.errors[errors[field]] : undefined)

     return (
          <form {...form.formProps} className="flex flex-1 flex-col">
               <input type="hidden" name="returnTo" value={returnTo} />
               <FormAlert message={state.formError ? m.errors[state.formError] : undefined} />

               <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                    <Field id={form.id('zone')} label={copy.zone} error={msg('zone')}>
                         <input
                              {...form.fieldProps('zone')}
                              maxLength={TABLE_LIMITS.zone}
                              placeholder={copy.zonePlaceholder}
                              defaultValue={initial.zone}
                              onChange={() => form.clearError('zone')}
                              className={inputClass}
                         />
                    </Field>
                    <Field
                         id={form.id('count')}
                         label={copy.count}
                         error={msg('count')}
                         hint={interpolate(copy.limitNote, {
                              max: localizeDigits(maxTables, locale),
                         })}
                         required
                    >
                         <Stepper
                              id={form.id('count')}
                              name="count"
                              value={count}
                              min={1}
                              max={maxTables}
                              onChange={(n) => {
                                   setCount(n)
                                   form.clearError('count')
                              }}
                              decreaseLabel={copy.decrease}
                              increaseLabel={copy.increase}
                              invalid={Boolean(errors.count)}
                         />
                    </Field>
               </div>

               <div className="mt-5 grid grid-cols-3 gap-2.5">
                    {Array.from({ length: shown }, (_, i) => {
                         const label = tableLabel(i + 1)
                         return (
                              <figure
                                   key={label}
                                   className="rounded-xl border border-line bg-white p-2 text-center"
                              >
                                   <QrCode
                                        value={buildTableQrUrl(
                                             qr.origin,
                                             qr.orgSlug,
                                             label,
                                             qr.keys[i + 1],
                                        )}
                                        label={label}
                                   />
                                   <figcaption className="tabular mt-1 text-xs font-semibold text-ink">
                                        {label}
                                   </figcaption>
                              </figure>
                         )
                    })}
               </div>
               <p className="mt-2 text-xs text-ink-3">
                    {copy.previewNote}{' '}
                    {count > shown &&
                         interpolate(copy.showing, {
                              shown: localizeDigits(shown, locale),
                              total: localizeDigits(count, locale),
                         })}
               </p>
               <p className="mt-1 text-xs text-ink-3">{copy.printLater}</p>

               {checklist && <div className="mt-5">{checklist}</div>}

               <div className="mt-auto pt-8">
                    <SubmitButton
                         pending={form.pending}
                         disabled={!form.ready}
                         label={submitLabel ?? copy.finish}
                         pendingLabel={common.states.saving}
                    />
               </div>
          </form>
     )
}
