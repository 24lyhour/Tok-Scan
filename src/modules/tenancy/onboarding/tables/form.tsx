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
     initial,
     qr,
     checklist,
}: {
     initial: { zone: string; count: number }
     /** For previews: public origin, organization slug, and saved QR keys by table number */
     qr: { origin: string; orgSlug: string; keys: Record<number, string> }
     /** Go-live checklist (rendered on the server) */
     checklist: ReactNode
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
     const [intent, setIntent] = useState<'print' | 'finish'>('finish')

     const shown = Math.min(count, PREVIEW_MAX)
     const msg = (field: TablesField) => (errors[field] ? m.errors[errors[field]] : undefined)

     return (
          <form {...form.formProps} className="flex flex-1 flex-col">
               <FormAlert message={state.formError ? m.errors[state.formError] : undefined} />

               <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                    <Field id={form.id('zone')} label={copy.zone} error={msg('zone')} required>
                         <input
                              {...form.fieldProps('zone')}
                              required
                              maxLength={TABLE_LIMITS.zone}
                              placeholder={copy.zonePlaceholder}
                              defaultValue={initial.zone}
                              onChange={() => form.clearError('zone')}
                              className={inputClass}
                         />
                    </Field>
                    <Field id={form.id('count')} label={copy.count} error={msg('count')} required>
                         <Stepper
                              id={form.id('count')}
                              name="count"
                              value={count}
                              min={1}
                              max={TABLE_LIMITS.perOutlet}
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

               <div className="mt-5">{checklist}</div>

               <div className="mt-auto space-y-2.5 pt-8">
                    <SubmitButton
                         variant="secondary"
                         name="intent"
                         value="print"
                         onClick={() => setIntent('print')}
                         pending={form.pending && intent === 'print'}
                         disabled={form.pending || !form.ready}
                         label={copy.download}
                         pendingLabel={common.states.saving}
                    />
                    <SubmitButton
                         name="intent"
                         value="finish"
                         onClick={() => setIntent('finish')}
                         pending={form.pending && intent === 'finish'}
                         disabled={form.pending || !form.ready}
                         label={copy.finish}
                         pendingLabel={common.states.saving}
                    />
               </div>
          </form>
     )
}
