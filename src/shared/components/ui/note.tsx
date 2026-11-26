import { Info } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

/** Calm information box (approval notes, tips). Not for errors — use FormAlert for those. */
export function Note({ children, className }: { children: ReactNode; className?: string }) {
     return (
          <p
               className={cn(
                    'flex gap-2.5 rounded-2xl border border-line bg-white p-4 text-sm leading-relaxed text-ink-2',
                    className,
               )}
          >
               <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-info" />
               <span>{children}</span>
          </p>
     )
}
