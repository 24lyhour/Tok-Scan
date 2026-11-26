import { cn } from '@/shared/lib/utils'

/**
 * A restaurant's initials on its brand colour (guide p.24 switcher, p.27 console list).
 * Logo upload shows here later.
 */
export function OrgAvatar({
     name,
     color,
     className,
}: {
     name: string
     /** Brand colour (hex); falls back to brand green */
     color?: string | null
     className?: string
}) {
     const words = name.trim().split(/\s+/).filter(Boolean)
     const letters = ((words[0]?.[0] ?? 'T') + (words[1]?.[0] ?? '')).toUpperCase()
     return (
          <span
               aria-hidden
               className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-xs font-bold text-white',
                    className,
               )}
               style={color ? { backgroundColor: color } : undefined}
          >
               {letters}
          </span>
     )
}
