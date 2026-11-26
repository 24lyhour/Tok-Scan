import { COLORS } from '@/shared/config/colors'
import { cn } from '@/shared/lib/utils'

/**
 * Brand colours as plain values, so the logo also renders where Tailwind isn't loaded (the Payload
 * admin). In the app the Tailwind classes win; both come from the same tokens.
 */
const MARK = {
     green: COLORS['brand-700'],
     paper: COLORS.paper,
     saffron: COLORS['saffron-500'],
} as const

/**
 * tok-scan mark: scan brackets around a table ("tok" = table in Khmer) with a guest (saffron dot).
 * Drawn on a 64×64 grid so it stays crisp from 16px favicons to hero sizes.
 */
export function LogoMark({
     className,
     tile = false,
     title = 'tok-scan',
}: {
     className?: string
     /** Render on a rounded tile (app-icon style, as in the guide's headers) */
     tile?: boolean
     title?: string
}) {
     return (
          <svg
               viewBox="0 0 64 64"
               {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
               className={cn('shrink-0', className)}
          >
               {tile && (
                    <rect
                         width="64"
                         height="64"
                         rx="16"
                         fill={MARK.green}
                         className="fill-brand-700"
                    />
               )}
               <g
                    fill="none"
                    strokeLinecap="round"
                    strokeWidth="4"
                    stroke={tile ? MARK.paper : MARK.green}
                    className={tile ? 'stroke-paper' : 'stroke-brand-700'}
               >
                    <path d="M10 20v-4a6 6 0 0 1 6-6h4" />
                    <path d="M44 10h4a6 6 0 0 1 6 6v4" />
                    <path d="M54 44v4a6 6 0 0 1-6 6h-4" />
                    <path d="M20 54h-4a6 6 0 0 1-6-6v-4" />
               </g>
               <g
                    fill={tile ? MARK.paper : MARK.green}
                    className={tile ? 'fill-paper' : 'fill-brand-700'}
               >
                    <rect x="17" y="28" width="30" height="6" rx="2" />
                    <rect x="22" y="33" width="5" height="15" rx="1" />
                    <rect x="37" y="33" width="5" height="15" rx="1" />
               </g>
               <circle cx="32" cy="20.5" r="5" fill={MARK.saffron} className="fill-saffron-500" />
          </svg>
     )
}

/** Full lockup: mark + "tok·scan" wordmark (+ optional "SCAN · ORDER · PAY" tagline). */
export function Logo({
     className,
     tagline = true,
     inverted = false,
     size = 'md',
}: {
     className?: string
     tagline?: boolean
     /** Light text for dark (green) backgrounds */
     inverted?: boolean
     size?: 'sm' | 'md'
}) {
     return (
          <span className={cn('inline-flex items-center gap-2.5', className)}>
               <LogoMark tile className={size === 'sm' ? 'size-8' : 'size-9'} title="" />
               <span aria-hidden className="flex flex-col leading-none">
                    <span
                         className={cn(
                              'font-bold tracking-tight',
                              size === 'sm' ? 'text-base' : 'text-lg',
                              inverted ? 'text-white' : 'text-brand-700',
                         )}
                    >
                         tok<span className="text-saffron-500">·</span>scan
                    </span>
                    {tagline && (
                         <span
                              className={cn(
                                   'mt-1 text-[0.5625rem] font-semibold tracking-[0.2em]',
                                   inverted ? 'text-white/60' : 'text-ink-3',
                              )}
                         >
                              SCAN · ORDER · PAY
                         </span>
                    )}
               </span>
               <span className="sr-only">tok-scan</span>
          </span>
     )
}
