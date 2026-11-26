import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

import { Card } from './card'

/** One number with a label and icon (guide p.8 stat cards). Reused by dashboards and reports. */
export function StatCard({
     label,
     value,
     icon: Icon,
     footer,
     className,
}: {
     label: string
     value: ReactNode
     icon: LucideIcon
     /** e.g. a trend line or "↑ 12.4%" */
     footer?: ReactNode
     className?: string
}) {
     return (
          <Card className={cn('gap-2 rounded-2xl px-4 py-4 ring-line', className)}>
               <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-ink-3">{label}</p>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-paper text-ink-2">
                         <Icon aria-hidden className="size-4" />
                    </span>
               </div>
               <p className="tabular text-2xl font-bold tracking-tight text-ink">{value}</p>
               {footer}
          </Card>
     )
}
