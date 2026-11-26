import { Search } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Search row above a table: a plain GET form, so the filter lives in the URL (shareable, works
 * without JavaScript). `keep` carries other filters (e.g. the current tab) along.
 */
export function TableSearch({
     action,
     placeholder,
     defaultValue,
     name = 'q',
     maxLength = 80,
     keep = {},
     children,
}: {
     /** Page URL the form submits to */
     action: string
     placeholder: string
     defaultValue?: string
     name?: string
     maxLength?: number
     /** Hidden fields to keep, e.g. { status: 'active' } */
     keep?: Record<string, string | undefined>
     /** Extra buttons on the right (filters, CSV export…) */
     children?: ReactNode
}) {
     return (
          <form action={action} className="flex flex-wrap items-center gap-2 p-3">
               {Object.entries(keep).map(
                    ([key, value]) =>
                         value && <input key={key} type="hidden" name={key} value={value} />,
               )}
               <label className="relative min-w-48 flex-1">
                    <span className="sr-only">{placeholder}</span>
                    <Search
                         aria-hidden
                         className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3"
                    />
                    <input
                         type="search"
                         name={name}
                         defaultValue={defaultValue}
                         maxLength={maxLength}
                         placeholder={placeholder}
                         className="h-10 w-full rounded-xl border border-line bg-white pr-3 pl-9 text-sm outline-none placeholder:text-ink-3 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15"
                    />
               </label>
               {children}
          </form>
     )
}

/** Small outlined button for the search row (Plan filter, CSV …). Disabled = "Soon". */
export function TableToolButton({
     children,
     disabled,
     title,
}: {
     children: ReactNode
     disabled?: boolean
     title?: string
}) {
     return (
          <button
               type="button"
               disabled={disabled}
               title={title}
               className="flex h-10 items-center gap-1.5 rounded-xl border border-line px-3 text-sm font-medium text-ink-2 hover:bg-paper disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
               {children}
          </button>
     )
}
