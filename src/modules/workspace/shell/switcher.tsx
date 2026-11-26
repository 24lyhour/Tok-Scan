'use client'

import { Check, ChevronsUpDown, LayoutGrid, MapPin, Plus } from 'lucide-react'
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components'

import { useTranslations } from '@/i18n/client'
import { OrgAvatar } from '@/shared/components/ui/org-avatar'
import { interpolate, localizeDigits, plural } from '@/shared/i18n/format'
import { cn } from '@/shared/lib/utils'

export type SwitcherOrg = {
     id: number
     name: string
     color: string
     role: 'owner' | 'admin' | 'member'
     outlets: number
     current: boolean
}
export type SwitcherOutlet = { id: number; name: string; tables: number; current: boolean }

/**
 * Organization & outlet switcher (guide p.24). Lists the owner's organizations and the current
 * organization's outlets. Switching and "Create outlet" arrive with multi-outlet support.
 */
export function Switcher({
     organizations,
     outlets,
     maxOutlets,
}: {
     organizations: SwitcherOrg[]
     outlets: SwitcherOutlet[]
     /** Plan limit (null = no fixed limit) */
     maxOutlets: number | null
}) {
     const { m, locale } = useTranslations('workspace')
     const copy = m.switcher
     const n = (value: number) => localizeDigits(value, locale)
     const org = organizations.find((o) => o.current) ?? organizations[0]
     const outletIndex = outlets.findIndex((o) => o.current)
     const outlet = outlets[outletIndex]
     if (!org || !outlet) return null

     return (
          <DialogTrigger>
               <Button
                    aria-label={copy.label}
                    className="flex w-full items-center gap-2.5 rounded-xl border border-saffron-500/50 bg-white/5 p-2 text-left outline-none hover:bg-white/10 data-[focus-visible]:ring-3 data-[focus-visible]:ring-white/30"
               >
                    <OrgAvatar name={org.name} color={org.color} />
                    <span className="min-w-0 flex-1">
                         <span className="block truncate text-sm font-semibold text-white">
                              {org.name}
                         </span>
                         <span className="block truncate text-xs text-white/65">
                              {interpolate(copy.current, {
                                   outlet: outlet.name,
                                   index: n(outletIndex + 1),
                                   total: n(outlets.length),
                              })}
                         </span>
                    </span>
                    <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-white/60" />
               </Button>
               <Popover
                    placement="bottom start"
                    offset={8}
                    className="z-50 w-[19rem] overflow-hidden rounded-2xl border border-line bg-white shadow-popover data-[entering]:animate-in data-[entering]:fade-in data-[entering]:zoom-in-95"
               >
                    <Dialog aria-label={copy.label} className="outline-none">
                         <SectionTitle>{copy.organizations}</SectionTitle>
                         <ul className="px-1.5 pb-1.5">
                              {organizations.map((o) => (
                                   <li
                                        key={o.id}
                                        aria-current={o.current || undefined}
                                        className={cn(
                                             'flex items-center gap-2.5 rounded-lg px-2 py-2',
                                             o.current && 'bg-brand-50',
                                        )}
                                   >
                                        <OrgAvatar name={o.name} color={o.color} />
                                        <span className="min-w-0 flex-1">
                                             <span className="block truncate text-sm font-semibold text-ink">
                                                  {o.name}
                                             </span>
                                             <span className="block text-xs text-ink-3">
                                                  {interpolate(copy.membership, {
                                                       role: copy.roles[o.role],
                                                       outlets: plural(
                                                            locale,
                                                            o.outlets,
                                                            copy.outletCount,
                                                       ),
                                                  })}
                                             </span>
                                        </span>
                                        {o.current && (
                                             <Check aria-hidden className="size-4 text-brand-700" />
                                        )}
                                   </li>
                              ))}
                         </ul>

                         <div className="border-t border-line">
                              <SectionTitle>
                                   {interpolate(copy.outletsOf, { org: org.name })}
                              </SectionTitle>
                              <ul className="px-1.5 pb-1.5 text-sm">
                                   <li className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-ink-3">
                                        <LayoutGrid aria-hidden className="size-4" />
                                        <span className="flex-1">{copy.allOutlets}</span>
                                        <span className="text-xs">{copy.reportsOnly}</span>
                                   </li>
                                   {outlets.map((o) => (
                                        <li
                                             key={o.id}
                                             aria-current={o.current || undefined}
                                             className={cn(
                                                  'flex items-center gap-2.5 rounded-lg px-2 py-2 text-ink',
                                                  o.current && 'bg-brand-50 font-semibold',
                                             )}
                                        >
                                             <MapPin aria-hidden className="size-4 text-ink-3" />
                                             <span className="flex-1 truncate">{o.name}</span>
                                             <span className="text-xs font-normal text-ink-3">
                                                  {interpolate(copy.tables, { count: n(o.tables) })}
                                             </span>
                                             {o.current && (
                                                  <Check
                                                       aria-hidden
                                                       className="size-4 text-brand-700"
                                                  />
                                             )}
                                        </li>
                                   ))}
                              </ul>
                         </div>

                         <div className="flex items-center gap-2 border-t border-line px-4 py-3 text-sm">
                              <Plus aria-hidden className="size-4 text-ink-3" />
                              <span className="flex-1 font-semibold text-ink-3">
                                   {copy.createOutlet}
                              </span>
                              {maxOutlets !== null && (
                                   <span className="text-xs text-ink-3">
                                        {interpolate(copy.used, {
                                             used: n(outlets.length),
                                             max: n(maxOutlets),
                                        })}
                                   </span>
                              )}
                         </div>
                    </Dialog>
               </Popover>
          </DialogTrigger>
     )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
     return (
          <p className="px-4 pt-3 pb-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
               {children}
          </p>
     )
}
