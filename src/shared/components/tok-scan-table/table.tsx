import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

export type TableColumn<Row> = {
     id: string
     /** Header text (uppercase small caps, guide p.27) */
     header: ReactNode
     /** Header only for screen readers (e.g. a "⋯" actions column) */
     srOnlyHeader?: boolean
     cell: (row: Row) => ReactNode
     align?: 'left' | 'right' | 'center'
     /** Extra classes for this column's cells, e.g. 'w-10' or 'whitespace-nowrap' */
     className?: string
}

const ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' } as const

/**
 * tok-scan data table (guide p.27 / p.10 / p.12): small uppercase headers, quiet row lines,
 * highlighted selected row, numbers right-aligned. Scrolls sideways on phones.
 *
 *   <TokScanTable
 *        rows={orders}
 *        rowKey={(o) => o.id}
 *        columns={[{ id: 'no', header: 'Order', cell: (o) => o.number }, …]}
 *        empty="No orders yet."
 *   />
 */
export function TokScanTable<Row>({
     columns,
     rows,
     rowKey,
     isSelected,
     empty,
     minWidth = '44rem',
     caption,
}: {
     columns: TableColumn<Row>[]
     rows: Row[]
     rowKey: (row: Row) => string | number
     /** Highlights the row whose detail panel is open */
     isSelected?: (row: Row) => boolean
     /** Shown when there are no rows */
     empty: ReactNode
     /** Below this width the table scrolls sideways instead of squeezing */
     minWidth?: string
     /** Accessible name of the table */
     caption?: string
}) {
     return (
          <div className="overflow-x-auto">
               <table className="w-full text-sm" style={{ minWidth }}>
                    {caption && <caption className="sr-only">{caption}</caption>}
                    <thead>
                         <tr className="border-y border-line bg-paper/60 text-[0.6875rem] font-semibold tracking-[0.08em] text-ink-3 uppercase">
                              {columns.map((col, i) => (
                                   <th
                                        key={col.id}
                                        scope="col"
                                        className={cn(
                                             'py-2.5',
                                             i === 0 ? 'px-4' : 'px-3',
                                             ALIGN[col.align ?? 'left'],
                                             col.className,
                                        )}
                                   >
                                        {col.srOnlyHeader ? (
                                             <span className="sr-only">{col.header}</span>
                                        ) : (
                                             col.header
                                        )}
                                   </th>
                              ))}
                         </tr>
                    </thead>
                    <tbody>
                         {rows.length === 0 && (
                              <tr>
                                   <td
                                        colSpan={columns.length}
                                        className="px-4 py-10 text-center text-ink-3"
                                   >
                                        {empty}
                                   </td>
                              </tr>
                         )}
                         {rows.map((row) => {
                              const selected = isSelected?.(row) ?? false
                              return (
                                   <tr
                                        key={rowKey(row)}
                                        aria-selected={isSelected ? selected : undefined}
                                        className={cn(
                                             'border-b border-line last:border-0',
                                             selected ? 'bg-brand-50/60' : 'hover:bg-paper/60',
                                        )}
                                   >
                                        {columns.map((col, i) => (
                                             <td
                                                  key={col.id}
                                                  className={cn(
                                                       'py-2.5',
                                                       i === 0 ? 'px-4' : 'px-3',
                                                       ALIGN[col.align ?? 'left'],
                                                       col.align === 'right' && 'tabular',
                                                       col.className,
                                                  )}
                                             >
                                                  {col.cell(row)}
                                             </td>
                                        ))}
                                   </tr>
                              )
                         })}
                    </tbody>
               </table>
          </div>
     )
}

/** The white rounded card that holds tabs, search, table and pagination. */
export function TableCard({ children, className }: { children: ReactNode; className?: string }) {
     return (
          <section
               className={cn(
                    'min-w-0 overflow-hidden rounded-2xl border border-line bg-white',
                    className,
               )}
          >
               {children}
          </section>
     )
}
