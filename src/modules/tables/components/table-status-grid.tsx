import { Legend } from '@/shared/components/ui/legend'
import { localizeDigits } from '@/shared/i18n/format'
import type { Locale } from '@/shared/i18n/locales'
import { cn } from '@/shared/lib/utils'

import { TABLE_STATUS_STYLES, TABLE_STATUSES, type TableStatus } from '../status'

export type GridTable = {
     id: number | string
     number: number
     label: string
     zone?: string | null
     status: TableStatus
}

/** Tables as coloured tiles + a status legend (dashboard "Live tables", later POS). */
export function TableStatusGrid({
     tables,
     statusLabels,
     locale,
}: {
     tables: GridTable[]
     statusLabels: Record<TableStatus, string>
     locale: Locale
}) {
     return (
          <>
               <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                    {tables.map((t) => (
                         <li
                              key={t.id}
                              title={[t.label, t.zone, statusLabels[t.status]]
                                   .filter(Boolean)
                                   .join(' · ')}
                              className={cn(
                                   'tabular flex h-11 items-center justify-center rounded-lg text-sm font-semibold',
                                   TABLE_STATUS_STYLES[t.status],
                              )}
                         >
                              {localizeDigits(String(t.number).padStart(2, '0'), locale)}
                         </li>
                    ))}
               </ul>
               <Legend
                    className="mt-4"
                    items={TABLE_STATUSES.map((s) => ({
                         label: statusLabels[s],
                         swatch: TABLE_STATUS_STYLES[s],
                    }))}
               />
          </>
     )
}
