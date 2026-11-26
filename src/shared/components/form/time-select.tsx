'use client'

import { Check, ChevronDown, Clock, Moon } from 'lucide-react'
import {
     Button,
     ListBox,
     ListBoxItem,
     Popover,
     Select,
     SelectValue,
     type Key,
} from 'react-aria-components'

import { getLocaleConfig, type Locale } from '@/shared/i18n/locales'
import { localizeDigits } from '@/shared/i18n/format'
import { cn } from '@/shared/lib/utils'

/** "00:00", "00:30" … "23:30" — every `step` minutes */
export function timeSlots(step = 30): string[] {
     return Array.from({ length: (24 * 60) / step }, (_, i) => {
          const minutes = i * step
          return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
     })
}

/** "22:00" → "10:00 PM" (en) · "២២:០០" (km) · "22:00" (zh) — the reader's own clock style */
export function formatTime(value: string, locale: Locale): string {
     const [h = 0, m = 0] = value.split(':').map(Number)
     const text = new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
          hour: 'numeric',
          minute: '2-digit',
     }).format(new Date(2000, 0, 1, h, m))
     return localizeDigits(text, locale)
}

/**
 * Time dropdown (guide p.03 "Controls") — replaces the browser's <input type="time">, which looks
 * different in every browser and is fiddly on phones.
 * - 30-minute steps, opens scrolled to the current value, full keyboard support (react-aria).
 * - Posts "HH:MM" (24 h) with the form under `name`.
 */
export function TimeSelect({
     id,
     name,
     label,
     value,
     onChange,
     locale,
     step = 30,
     note,
     invalid,
     required,
}: {
     id: string
     name: string
     /** Accessible name (the visible label is the surrounding <Field>) */
     label: string
     value: string
     onChange: (next: string) => void
     locale: Locale
     step?: number
     /** Short line under the button, e.g. "Closes after midnight (next day)" */
     note?: string
     invalid?: boolean
     required?: boolean
}) {
     const slots = timeSlots(step)
     // Keep a saved value that isn't on the grid (e.g. 10:15) selectable
     const options = slots.includes(value) ? slots : [...slots, value].sort()

     return (
          <div>
               <Select
                    aria-label={label}
                    name={name}
                    isRequired={required}
                    isInvalid={invalid}
                    selectedKey={value}
                    onSelectionChange={(key: Key | null) => key !== null && onChange(String(key))}
                    // Open the list scrolled to the chosen time, not at midnight
                    onOpenChange={(open) => {
                         if (!open) return
                         requestAnimationFrame(() =>
                              document
                                   .querySelector(`[data-time-list="${id}"] [data-selected]`)
                                   ?.scrollIntoView({ block: 'center' }),
                         )
                    }}
               >
                    <Button
                         id={id}
                         className={cn(
                              'flex h-12 w-full items-center gap-2.5 rounded-[11px] border bg-white px-3.5 text-left text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] duration-[120ms]',
                              'data-[focus-visible]:border-brand-500 data-[focus-visible]:ring-3 data-[focus-visible]:ring-brand-500/15 data-[pressed]:border-brand-500',
                              invalid ? 'border-error' : 'border-line hover:border-brand-300',
                         )}
                    >
                         <Clock aria-hidden className="size-4 shrink-0 text-ink-3" />
                         <SelectValue className="tabular min-w-0 flex-1 truncate font-medium">
                              {() => formatTime(value, locale)}
                         </SelectValue>
                         <ChevronDown aria-hidden className="size-4 shrink-0 text-ink-3" />
                    </Button>
                    <Popover
                         offset={6}
                         className="z-50 w-(--trigger-width) overflow-hidden rounded-xl border border-line bg-white shadow-[0_16px_40px_-16px_rgb(22_24_29/0.35)] data-[entering]:animate-in data-[entering]:fade-in data-[entering]:zoom-in-95"
                    >
                         <ListBox
                              data-time-list={id}
                              className="max-h-64 overflow-y-auto p-1 outline-none"
                         >
                              {options.map((time) => (
                                   <ListBoxItem
                                        key={time}
                                        id={time}
                                        textValue={formatTime(time, locale)}
                                        className="tabular flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-ink outline-none data-[focused]:bg-paper data-[selected]:font-semibold data-[selected]:text-brand-700"
                                   >
                                        {({ isSelected }) => (
                                             <>
                                                  {formatTime(time, locale)}
                                                  {isSelected && (
                                                       <Check
                                                            aria-hidden
                                                            className="size-4 text-brand-700"
                                                       />
                                                  )}
                                             </>
                                        )}
                                   </ListBoxItem>
                              ))}
                         </ListBox>
                    </Popover>
               </Select>
               {note && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-ink-2">
                         <Moon aria-hidden className="size-3.5 text-saffron-600" />
                         {note}
                    </p>
               )}
          </div>
     )
}
