'use client'

import { Check } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

/** Brand colour swatches with a "Contrast checked ✓" note (guide p.23). */
export function ColorSwatches({
     name,
     label,
     colors,
     value,
     onChange,
     checkedLabel,
}: {
     name: string
     label: string
     colors: readonly { value: string; label: string }[]
     value: string
     onChange: (next: string) => void
     checkedLabel: string
}) {
     return (
          <div className="flex flex-wrap items-center gap-2.5">
               <input type="hidden" name={name} value={value} />
               <div role="radiogroup" aria-label={label} className="flex gap-2">
                    {colors.map((c) => {
                         const active = c.value === value
                         return (
                              <button
                                   key={c.value}
                                   type="button"
                                   role="radio"
                                   aria-checked={active}
                                   aria-label={c.label}
                                   title={c.label}
                                   onClick={() => onChange(c.value)}
                                   style={{ backgroundColor: c.value }}
                                   className={cn(
                                        'flex size-10 items-center justify-center rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-brand-300',
                                        active && 'ring-2 ring-ink ring-offset-2',
                                   )}
                              >
                                   {active && <Check className="size-4 text-white" />}
                              </button>
                         )
                    })}
               </div>
               <span className="inline-flex items-center gap-1 text-xs text-ink-3">
                    {checkedLabel} <Check aria-hidden className="size-3.5 text-success" />
               </span>
          </div>
     )
}
