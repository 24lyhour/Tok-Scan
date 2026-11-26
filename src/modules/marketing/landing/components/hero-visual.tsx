import { Plus, Star } from 'lucide-react'
import type { ReactNode } from 'react'

import { KitchenTicket } from '@/shared/components/illustrations/kitchen-ticket'
import { formatMoney } from '@/shared/i18n/format'
import { cn } from '@/shared/lib/utils'

import type { LandingContent } from '@/i18n/messages'

import { FakeQr } from './fake-qr'

function Phone({ className, children }: { className?: string; children: ReactNode }) {
     return (
          <div
               className={cn(
                    'absolute rounded-[2rem] bg-ink p-1.5 shadow-device ring-1 ring-white/10 sm:rounded-[2.4rem] sm:p-2',
                    className,
               )}
          >
               <div className="relative h-full overflow-hidden rounded-[1.6rem] bg-white sm:rounded-[1.9rem]">
                    <div className="absolute top-1.5 left-1/2 z-10 h-4 w-14 -translate-x-1/2 rounded-full bg-ink sm:h-5 sm:w-16" />
                    {children}
               </div>
          </div>
     )
}

/** Illustrated dish (Fish Amok in a banana-leaf bowl) — no stock photos, per the guide. */
function Dish({ className }: { className?: string }) {
     return (
          <div className={cn('relative aspect-square', className)}>
               <div className="absolute inset-[6%] rounded-full bg-white shadow-raised" />
               <div className="absolute inset-[16%] rounded-full bg-gradient-to-br from-saffron-300 to-saffron-600" />
               <div className="absolute top-[30%] left-[26%] size-[20%] rounded-full bg-saffron-100/90" />
               <div className="absolute top-[48%] left-[50%] size-[16%] rounded-full bg-saffron-100/80" />
               <div className="absolute top-[52%] left-[28%] size-[13%] rounded-full bg-saffron-50/70" />
               <div className="absolute -top-[2%] right-[-6%] h-[26%] w-[50%] rotate-[-8deg] rounded-[50%] bg-herb" />
               <div className="absolute bottom-[8%] left-[-4%] h-[18%] w-[34%] rotate-[10deg] rounded-[50%] bg-herb" />
          </div>
     )
}

type VisualCopy = LandingContent['hero']['visual']

function MenuScreen({ m }: { m: VisualCopy }) {
     return (
          <div className="flex h-full flex-col">
               <div className="flex flex-[1.1] items-center justify-center bg-gradient-to-b from-saffron-100 to-saffron-50 pt-6">
                    <Dish className="w-[64%]" />
               </div>
               <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-saffron-50 px-2 py-0.5 text-[0.625rem] font-semibold text-saffron-600 ring-1 ring-saffron-300">
                         <Star aria-hidden className="size-2.5" /> {m.signature}
                    </span>
                    <p className="text-sm font-bold text-ink sm:text-lg">{m.dish}</p>
                    <p className="line-clamp-2 text-[0.625rem] leading-snug text-ink-3 sm:text-xs">
                         {m.dishDescription}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                         <span className="tabular text-sm font-bold text-ink sm:text-base">
                              $6.50
                         </span>
                         <span className="inline-flex items-center gap-1 rounded-lg bg-brand-700 px-2 py-1 text-[0.625rem] font-semibold text-white sm:px-2.5 sm:text-xs">
                              <Plus aria-hidden className="size-3" /> {m.add}
                         </span>
                    </div>
               </div>
          </div>
     )
}

function KhqrScreen({ m }: { m: VisualCopy }) {
     return (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-paper px-2.5 pt-6 pb-3 sm:px-3">
               <div className="w-full overflow-hidden rounded-xl bg-white shadow-raised ring-1 ring-line">
                    <div className="relative bg-khqr px-2.5 py-1.5 text-[0.625rem] font-bold tracking-wide text-white sm:text-xs">
                         KHQR
                    </div>
                    <div className="p-2.5 sm:p-3">
                         <p className="text-[0.5rem] font-medium tracking-wider text-ink-3 uppercase sm:text-[0.5625rem]">
                              Tok-Scans
                         </p>
                         <p className="tabular text-sm font-bold text-ink sm:text-lg">
                              {formatMoney(30.67)}
                         </p>
                         <div className="mt-2 border-t border-dashed border-line pt-2">
                              <FakeQr seed={11} className="w-full" />
                         </div>
                    </div>
               </div>
               <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[0.625rem] font-semibold text-success sm:text-xs">
                    <span className="size-1.5 rounded-full bg-success" /> {m.paid}
               </span>
          </div>
     )
}

/** Hero illustration: guest menu, KHQR bill and kitchen ticket — "show the product" (guide p.21). */
export function HeroVisual({
     className,
     label,
     m,
}: {
     className?: string
     label: string
     m: VisualCopy
}) {
     return (
          <div
               role="img"
               aria-label={label}
               className={cn('relative mx-auto aspect-[10/9] w-full max-w-[520px]', className)}
          >
               <Phone className="top-0 left-[8%] h-[88%] w-[46%]">
                    <MenuScreen m={m} />
               </Phone>
               <Phone className="top-[12%] right-0 h-[76%] w-[36%]">
                    <KhqrScreen m={m} />
               </Phone>
               <KitchenTicket
                    table="T07"
                    item={m.ticketItem}
                    note={m.ticketNote}
                    action={m.markReady}
                    className="absolute bottom-[2%] left-0 w-[42%]"
               />
          </div>
     )
}
