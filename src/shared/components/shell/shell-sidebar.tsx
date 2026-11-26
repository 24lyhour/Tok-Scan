'use client'

import { Lock, Menu, X, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'

import { Logo } from '@/shared/components/brand/logo'
import { cn } from '@/shared/lib/utils'

export type ShellNavItem = {
     id: string
     label: string
     icon: LucideIcon
     /** Built pages only — without it the item shows "Soon" */
     href?: string
     /** Count pill, e.g. approvals waiting */
     badge?: number
     /** Not available yet for this user (e.g. QR codes before a menu exists) */
     locked?: boolean
}
export type ShellNavGroup = { id: string; label: string; items: ShellNavItem[] }

/** green = restaurant app (guide p.8) · charcoal = tok-scan super-admin console (guide p.27) */
export type ShellTone = 'green' | 'charcoal'

export type ShellSidebarLabels = {
     /** aria-label of the menu */
     main: string
     open: string
     close: string
     soon: string
     locked: string
}

type Props = {
     groups: ShellNavGroup[]
     labels: ShellSidebarLabels
     tone?: ShellTone
     /** Under the logo: organization switcher, console badge … */
     header?: ReactNode
     /** Bottom: plan card, user card … */
     footer?: ReactNode
}

const TONES = {
     green: { bg: 'bg-brand-900', activeIcon: '' },
     charcoal: { bg: 'bg-ink', activeIcon: 'text-saffron-500' },
} as const

/**
 * Dark app sidebar (guide p.8 / p.24 / p.27): logo, header slot, grouped menu, footer slot.
 * Desktop: sticky column. Phones: a top bar with a menu button that opens the same sidebar.
 * Used by the restaurant app (green) and the super-admin console (charcoal).
 */
export function ShellSidebar(props: Props) {
     const [open, setOpen] = useState(false)
     const bg = TONES[props.tone ?? 'green'].bg

     return (
          <>
               {/* Phones: top bar + drawer */}
               <div
                    className={cn(
                         'sticky top-0 z-40 flex h-14 items-center justify-between px-4 lg:hidden',
                         bg,
                    )}
               >
                    <Logo size="sm" inverted tagline={false} />
                    <button
                         type="button"
                         onClick={() => setOpen(true)}
                         aria-label={props.labels.open}
                         aria-expanded={open}
                         className="flex size-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
                    >
                         <Menu aria-hidden className="size-5" />
                    </button>
               </div>
               {open && (
                    <div
                         className="fixed inset-0 z-50 lg:hidden"
                         role="dialog"
                         aria-modal="true"
                         aria-label={props.labels.main}
                    >
                         <button
                              type="button"
                              aria-label={props.labels.close}
                              onClick={() => setOpen(false)}
                              className="absolute inset-0 bg-ink/50 motion-safe:animate-in motion-safe:fade-in"
                         />
                         <div className="relative h-full w-[17rem] max-w-[85vw] motion-safe:animate-in motion-safe:slide-in-from-left">
                              <SidebarBody {...props} onNavigate={() => setOpen(false)} />
                              <button
                                   type="button"
                                   onClick={() => setOpen(false)}
                                   aria-label={props.labels.close}
                                   className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
                              >
                                   <X aria-hidden className="size-5" />
                              </button>
                         </div>
                    </div>
               )}

               {/* Desktop */}
               <div className="sticky top-0 hidden h-dvh lg:block">
                    <SidebarBody {...props} />
               </div>
          </>
     )
}

function SidebarBody({
     groups,
     labels,
     tone = 'green',
     header,
     footer,
     onNavigate,
}: Props & { onNavigate?: () => void }) {
     const pathname = usePathname()
     const { bg, activeIcon } = TONES[tone]

     return (
          <aside className={cn('flex h-full flex-col overflow-y-auto px-3 py-4 text-white', bg)}>
               <div className="px-2">
                    <Logo size="sm" inverted />
               </div>
               {header && <div className="mt-4">{header}</div>}

               <nav aria-label={labels.main} className="mt-4 flex-1 space-y-4">
                    {groups.map((group) => (
                         <div key={group.id}>
                              <p className="px-3 pb-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-white/45 uppercase">
                                   {group.label}
                              </p>
                              <ul>
                                   {group.items.map((item) => (
                                        <li key={item.id}>
                                             <NavLink
                                                  item={item}
                                                  labels={labels}
                                                  activeIcon={activeIcon}
                                                  active={Boolean(
                                                       item.href &&
                                                       (pathname === item.href ||
                                                            pathname.startsWith(`${item.href}/`)),
                                                  )}
                                                  onNavigate={onNavigate}
                                             />
                                        </li>
                                   ))}
                              </ul>
                         </div>
                    ))}
               </nav>

               {footer && <div className="mt-4 space-y-3">{footer}</div>}
          </aside>
     )
}

function NavLink({
     item,
     labels,
     active,
     activeIcon,
     onNavigate,
}: {
     item: ShellNavItem
     labels: ShellSidebarLabels
     active: boolean
     activeIcon: string
     onNavigate?: () => void
}) {
     const Icon = item.icon
     const row = 'flex h-10 items-center gap-3 rounded-lg px-3 text-sm'

     if (!item.href || item.locked) {
          return (
               <span
                    aria-disabled="true"
                    title={item.locked ? labels.locked : labels.soon}
                    className={cn(row, 'cursor-not-allowed text-white/40')}
               >
                    <Icon aria-hidden className="size-[18px]" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.locked ? (
                         <Lock aria-label={labels.locked} className="size-3.5" />
                    ) : (
                         <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[0.625rem] font-semibold text-white/60">
                              {labels.soon}
                         </span>
                    )}
               </span>
          )
     }

     return (
          <Link
               href={item.href}
               onClick={onNavigate}
               aria-current={active ? 'page' : undefined}
               className={cn(
                    row,
                    'outline-none focus-visible:ring-3 focus-visible:ring-white/30',
                    active
                         ? 'bg-white/12 font-semibold text-white'
                         : 'text-white/80 hover:bg-white/8 hover:text-white',
               )}
          >
               <Icon aria-hidden className={cn('size-[18px]', active && activeIcon)} />
               <span className="flex-1 truncate">{item.label}</span>
               {Boolean(item.badge) && (
                    <span className="tabular rounded-full bg-saffron-500 px-1.5 py-0.5 text-[0.6875rem] font-bold text-ink">
                         {item.badge}
                    </span>
               )}
          </Link>
     )
}
