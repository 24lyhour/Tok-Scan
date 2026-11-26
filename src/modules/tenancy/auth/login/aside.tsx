import { Check, CircleCheck } from 'lucide-react'

import { LogoMark } from '@/shared/components/brand/logo'
import { KitchenTicket } from '@/shared/components/illustrations/kitchen-ticket'

import type { AuthContent } from '../content'

/** Brand panel beside the login card on large screens: promise + a small live-ticket illustration. */
export function LoginAside({ m }: { m: AuthContent['aside'] }) {
     return (
          <>
               <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_30%,var(--color-glow-brand),transparent_70%)]"
               />
               <LogoMark
                    title=""
                    className="absolute -right-24 -bottom-24 size-[28rem] opacity-[0.06] [&_*]:!stroke-white [&_*]:!fill-white"
               />
               <div className="relative flex flex-1 flex-col justify-center px-12 py-16 xl:px-20">
                    <h2 className="max-w-md text-4xl leading-tight font-bold tracking-tight text-balance">
                         {m.title}
                    </h2>
                    <p className="mt-4 max-w-md text-white/70">{m.body}</p>
                    <ul className="mt-8 space-y-3">
                         {m.points.map((p) => (
                              <li key={p} className="flex items-start gap-3 text-sm text-white/85">
                                   <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                                        <Check aria-hidden className="size-3 text-brand-300" />
                                   </span>
                                   {p}
                              </li>
                         ))}
                    </ul>

                    {/* Decorative: a kitchen ticket and a paid badge, like the product screens */}
                    <div aria-hidden className="mt-12 flex items-end gap-4">
                         <KitchenTicket
                              table={m.ticketTable}
                              item={m.ticketItem}
                              note={m.ticketNote}
                              action={m.markReady}
                              className="w-64"
                         />
                         <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-success shadow-lg">
                              <CircleCheck className="size-3.5" /> {m.paid}
                         </span>
                    </div>
               </div>
          </>
     )
}
