'use client'

import { Minus, Plus } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

/** − 16 + stepper (guide p.23 "Tables"). */
export function Stepper({
     id,
     name,
     value,
     min,
     max,
     onChange,
     decreaseLabel,
     increaseLabel,
     invalid,
}: {
     id: string
     name: string
     value: number
     min: number
     max: number
     onChange: (next: number) => void
     decreaseLabel: string
     increaseLabel: string
     invalid?: boolean
}) {
     const set = (n: number) =>
          onChange(Math.min(max, Math.max(min, Number.isFinite(n) ? Math.round(n) : min)))
     return (
          <div
               className={cn(
                    'inline-flex h-12 items-center rounded-[11px] border bg-white',
                    invalid ? 'border-error' : 'border-line',
               )}
          >
               <button
                    type="button"
                    onClick={() => set(value - 1)}
                    disabled={value <= min}
                    aria-label={decreaseLabel}
                    className="flex h-full w-11 items-center justify-center text-ink-2 hover:text-ink disabled:opacity-40"
               >
                    <Minus className="size-4" />
               </button>
               <input
                    id={id}
                    name={name}
                    type="number"
                    inputMode="numeric"
                    required
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    aria-invalid={invalid || undefined}
                    className="tabular h-full w-14 [appearance:textfield] bg-transparent text-center text-[0.9375rem] font-semibold text-ink outline-none [&::-webkit-inner-spin-button]:appearance-none"
               />
               <button
                    type="button"
                    onClick={() => set(value + 1)}
                    disabled={value >= max}
                    aria-label={increaseLabel}
                    className="flex h-full w-11 items-center justify-center text-ink-2 hover:text-ink disabled:opacity-40"
               >
                    <Plus className="size-4" />
               </button>
          </div>
     )
}
