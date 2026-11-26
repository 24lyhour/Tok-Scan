import { LoaderCircle } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/utils'

/** Primary (filled) or secondary (outlined) submit button. `name`/`value` say which one was clicked. */
export function SubmitButton({
     pending,
     label,
     pendingLabel,
     variant = 'primary',
     disabled,
     ...props
}: {
     pending: boolean
     label: string
     pendingLabel: string
     variant?: 'primary' | 'secondary'
} & Pick<ComponentProps<'button'>, 'name' | 'value' | 'disabled' | 'onClick'>) {
     return (
          <button
               type="submit"
               disabled={pending || disabled}
               {...props}
               className={cn(
                    'inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[0.9375rem] font-semibold transition-[background-color,opacity] duration-[120ms] outline-none focus-visible:ring-3 focus-visible:ring-brand-300',
                    // Sending → wait cursor; not ready (required fields empty) → faded, not clickable
                    pending
                         ? 'cursor-wait opacity-80'
                         : 'disabled:cursor-not-allowed disabled:opacity-45',
                    variant === 'primary'
                         ? 'bg-brand-700 text-white enabled:hover:bg-brand-800'
                         : 'border border-line bg-white text-ink enabled:hover:bg-paper',
               )}
          >
               {pending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
               {pending ? pendingLabel : label}
          </button>
     )
}
