'use client'

import { cn } from '@/shared/lib/utils'

/** On/off switch (guide p.03 "Controls"). Renders a hidden input so it posts with the form. */
export function Toggle({
     name,
     checked,
     onChange,
     label,
}: {
     name: string
     checked: boolean
     onChange: (next: boolean) => void
     label: string
}) {
     return (
          <>
               <input type="hidden" name={name} value={checked ? 'on' : 'off'} />
               <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-label={label}
                    onClick={() => onChange(!checked)}
                    className={cn(
                         'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-[120ms] outline-none focus-visible:ring-3 focus-visible:ring-brand-300',
                         checked ? 'bg-brand-700' : 'bg-line',
                    )}
               >
                    <span
                         className={cn(
                              'inline-block size-5 rounded-full bg-white shadow transition-transform duration-[120ms]',
                              checked ? 'translate-x-6' : 'translate-x-1',
                         )}
                    />
               </button>
          </>
     )
}
