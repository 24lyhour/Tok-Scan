import { cn } from '@/shared/lib/utils'

/** Colour key under a chart or grid: a small swatch + label per item. */
export function Legend({
     items,
     className,
}: {
     items: { label: string; swatch: string }[]
     className?: string
}) {
     return (
          <ul className={cn('flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2', className)}>
               {items.map(({ label, swatch }) => (
                    <li key={label} className="flex items-center gap-1.5">
                         <span aria-hidden className={cn('size-2.5 rounded-sm', swatch)} />
                         {label}
                    </li>
               ))}
          </ul>
     )
}
