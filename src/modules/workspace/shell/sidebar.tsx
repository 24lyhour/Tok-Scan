'use client'

import { Lock, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'

import { useTranslations } from '@/i18n/client'
import { Logo } from '@/shared/components/brand/logo'
import { cn } from '@/shared/lib/utils'

import { NAV, type NavItem } from './nav'

type Slots = {
     /** Organization / outlet switcher */
     switcher: ReactNode
     /** Plan card + user card (bottom) */
     footer: ReactNode
     /** QR codes open only once the menu exists */
     qrUnlocked: boolean
}

/**
 * Dark sidebar (guide p.8 / p.24): logo, switcher, grouped menu, plan + user at the bottom.
 * Desktop: fixed column. Phones: a top bar with a menu button that opens the same sidebar.
 */
export function Sidebar(props: Slots) {
     const { m } = useTranslations('workspace')
     const common = useTranslations('common').m
     const [open, setOpen] = useState(false)

     return (
          <>
               {/* Phones: top bar + drawer */}
               <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-brand-900 px-4 lg:hidden">
                    <Logo size="sm" inverted tagline={false} />
                    <button
                         type="button"
                         onClick={() => setOpen(true)}
                         aria-label={m.nav.open}
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
                         aria-label={m.nav.main}
                    >
                         <button
                              type="button"
                              aria-label={common.actions.close}
                              onClick={() => setOpen(false)}
                              className="absolute inset-0 bg-ink/50 motion-safe:animate-in motion-safe:fade-in"
                         />
                         <div className="relative h-full w-[17rem] max-w-[85vw] motion-safe:animate-in motion-safe:slide-in-from-left">
                              <SidebarBody {...props} onNavigate={() => setOpen(false)} />
                              <button
                                   type="button"
                                   onClick={() => setOpen(false)}
                                   aria-label={common.actions.close}
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
     switcher,
     footer,
     qrUnlocked,
     onNavigate,
}: Slots & { onNavigate?: () => void }) {
     const { m } = useTranslations('workspace')
     const common = useTranslations('common').m
     const pathname = usePathname()

     return (
          <aside className="flex h-full flex-col overflow-y-auto bg-brand-900 px-3 py-4 text-white">
               <div className="px-2">
                    <Logo size="sm" inverted />
               </div>
               <div className="mt-4">{switcher}</div>

               <nav aria-label={m.nav.main} className="mt-4 flex-1 space-y-4">
                    {NAV.map(({ group, items }) => (
                         <div key={group}>
                              <p className="px-3 pb-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-white/45 uppercase">
                                   {m.nav.groups[group]}
                              </p>
                              <ul>
                                   {items.map((item) => (
                                        <li key={item.id}>
                                             <NavLink
                                                  item={item}
                                                  label={m.nav.items[item.id]}
                                                  active={Boolean(
                                                       item.href && pathname === item.href,
                                                  )}
                                                  locked={Boolean(item.lockable && !qrUnlocked)}
                                                  soonLabel={common.states.soon}
                                                  lockedLabel={m.nav.locked}
                                                  onNavigate={onNavigate}
                                             />
                                        </li>
                                   ))}
                              </ul>
                         </div>
                    ))}
               </nav>

               <div className="mt-4 space-y-3">{footer}</div>
          </aside>
     )
}

function NavLink({
     item,
     label,
     active,
     locked,
     soonLabel,
     lockedLabel,
     onNavigate,
}: {
     item: NavItem
     label: string
     active: boolean
     locked: boolean
     soonLabel: string
     lockedLabel: string
     onNavigate?: () => void
}) {
     const Icon = item.icon
     const row = 'flex h-10 items-center gap-3 rounded-lg px-3 text-sm'

     if (!item.href || locked) {
          return (
               <span
                    aria-disabled="true"
                    title={locked ? lockedLabel : soonLabel}
                    className={cn(row, 'cursor-not-allowed text-white/40')}
               >
                    <Icon aria-hidden className="size-[18px]" />
                    <span className="flex-1 truncate">{label}</span>
                    {locked ? (
                         <Lock aria-label={lockedLabel} className="size-3.5" />
                    ) : (
                         <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[0.625rem] font-semibold text-white/60">
                              {soonLabel}
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
               <Icon aria-hidden className="size-[18px]" />
               <span className="truncate">{label}</span>
          </Link>
     )
}
