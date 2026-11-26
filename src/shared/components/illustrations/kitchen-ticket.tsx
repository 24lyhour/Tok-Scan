import { Bell } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

/**
 * Decorative kitchen-display ticket (guide KDS screens) — used by the landing hero and the login
 * panel. Texts come from the caller so each page keeps its own translations.
 */
export function KitchenTicket({
     table,
     time = '8:04',
     item,
     note,
     action,
     className,
}: {
     table: string
     time?: string
     item: string
     note: string
     /** Button label, e.g. "Mark ready" */
     action: string
     className?: string
}) {
     return (
          <div
               aria-hidden
               className={cn(
                    'overflow-hidden rounded-xl bg-kds text-white shadow-device ring-1 ring-white/10',
                    className,
               )}
          >
               <div className="flex items-center justify-between border-b-2 border-progress px-2.5 py-2 sm:px-3">
                    <span className="rounded-md bg-progress px-1.5 py-0.5 text-xs font-bold sm:text-sm">
                         {table}
                    </span>
                    <span className="tabular text-xs font-bold sm:text-sm">{time}</span>
               </div>
               <div className="space-y-1.5 p-2.5 sm:p-3">
                    <p className="text-xs font-semibold sm:text-sm">{item}</p>
                    <p className="rounded-md bg-saffron-500/15 px-2 py-1 text-[0.625rem] font-medium text-saffron-300 sm:text-xs">
                         {note}
                    </p>
                    <span className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-kds-ready py-1.5 text-[0.625rem] font-semibold sm:py-2 sm:text-xs">
                         <Bell className="size-3" /> {action}
                    </span>
               </div>
          </div>
     )
}
