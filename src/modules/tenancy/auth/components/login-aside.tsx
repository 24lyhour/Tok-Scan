import { Bell, Check, CircleCheck } from 'lucide-react'

import { LogoMark } from '@/shared/components/brand/logo'

import type { AuthContent } from '../content'

/** Brand panel beside the login card on large screens: promise + a small live-ticket illustration. */
export function LoginAside({ m }: { m: AuthContent['aside'] }) {
     return (
          <>
               <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_30%,rgb(31_122_92/0.45),transparent_70%)]"
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
                         <div className="w-64 overflow-hidden rounded-xl bg-[#14171a] shadow-2xl ring-1 ring-white/10">
                              <div className="flex items-center justify-between border-b-2 border-progress px-3 py-2">
                                   <span className="rounded-md bg-progress px-1.5 py-0.5 text-sm font-bold">
                                        {m.ticketTable}
                                   </span>
                                   <span className="tabular text-sm font-bold">8:04</span>
                              </div>
                              <div className="space-y-2 p-3">
                                   <p className="text-sm font-semibold">{m.ticketItem}</p>
                                   <p className="rounded-md bg-saffron-500/15 px-2 py-1 text-xs font-medium text-saffron-300">
                                        {m.ticketNote}
                                   </p>
                                   <span className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0f766e] py-2 text-xs font-semibold">
                                        <Bell className="size-3" /> {m.markReady}
                                   </span>
                              </div>
                         </div>
                         <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-success shadow-lg">
                              <CircleCheck className="size-3.5" /> {m.paid}
                         </span>
                    </div>
               </div>
          </>
     )
}
