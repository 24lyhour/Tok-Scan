'use client'

import { cn } from '@/shared/lib/utils'

type ChoiceProps<V extends string> = {
     /** Used as the group's id, so a validation error can focus it */
     id: string
     name: string
     label: string
     options: readonly { value: V; label: string }[]
     invalid?: boolean
     /** At least one option must be chosen — counts towards the form's `ready` state */
     required?: boolean
     className?: string
}

/**
 * Chips for choosing options (Business type, opening days). A hidden input per selected value
 * posts with the form, so the server action reads it like a normal field.
 *   single:   <ChoiceChips value="cafe" onChange={setType} … />
 *   multiple: <ChoiceChips multiple value={['mon', 'tue']} onChange={setDays} … />
 */
export function ChoiceChips<V extends string>(
     props: ChoiceProps<V> &
          (
               | { multiple?: false; value: V; onChange: (next: V) => void }
               | { multiple: true; value: V[]; onChange: (next: V[]) => void }
          ),
) {
     const { id, name, label, options, invalid, required = false, className } = props
     const selected: V[] = props.multiple ? props.value : [props.value]

     const toggle = (value: V) => {
          if (!props.multiple) return props.onChange(value)
          const next = selected.includes(value)
               ? selected.filter((v) => v !== value)
               : options.map((o) => o.value).filter((v) => v === value || selected.includes(v))
          props.onChange(next)
     }

     return (
          <div
               id={id}
               tabIndex={-1}
               role={props.multiple ? 'group' : 'radiogroup'}
               aria-label={label}
               aria-invalid={invalid || undefined}
               aria-required={required || undefined}
               data-form-required={required}
               data-form-filled={selected.length > 0}
               className={cn('flex flex-wrap gap-2 rounded-xl outline-none', className)}
          >
               {selected.map((v) => (
                    <input key={v} type="hidden" name={name} value={v} />
               ))}
               {options.map((o) => {
                    const active = selected.includes(o.value)
                    return (
                         <button
                              key={o.value}
                              type="button"
                              {...(props.multiple
                                   ? { 'aria-pressed': active }
                                   : { role: 'radio', 'aria-checked': active })}
                              onClick={() => toggle(o.value)}
                              className={cn(
                                   'min-h-10 min-w-11 rounded-full border px-4 text-sm font-medium transition-colors duration-[120ms] outline-none focus-visible:ring-3 focus-visible:ring-brand-300',
                                   active
                                        ? 'border-brand-700 bg-brand-700 text-white'
                                        : 'border-line bg-white text-ink hover:border-brand-300',
                              )}
                         >
                              {o.label}
                         </button>
                    )
               })}
          </div>
     )
}
