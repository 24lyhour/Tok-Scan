import { cn } from '@/shared/lib/utils'

/** Status colours from the guide's strict status palette (p.02). */
export type StatusTone = 'success' | 'warning' | 'progress' | 'error' | 'neutral'

const TONES: Record<StatusTone, { pill: string; dot: string }> = {
     success: { pill: 'bg-success/10 text-success', dot: 'bg-success' },
     warning: { pill: 'bg-saffron-50 text-saffron-600', dot: 'bg-saffron-500' },
     progress: { pill: 'bg-progress/10 text-progress', dot: 'bg-progress' },
     error: { pill: 'bg-error/10 text-error', dot: 'bg-error' },
     neutral: { pill: 'bg-paper text-ink-2', dot: 'bg-ink-3' },
}

/** "● Active" pill (guide p.27 / p.10). Reused for organizations, orders, payments… */
export function StatusPill({
     tone,
     children,
     className,
}: {
     tone: StatusTone
     children: React.ReactNode
     className?: string
}) {
     return (
          <span
               className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
                    TONES[tone].pill,
                    className,
               )}
          >
               <span aria-hidden className={cn('size-1.5 rounded-full', TONES[tone].dot)} />
               {children}
          </span>
     )
}
