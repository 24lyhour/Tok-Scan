import { CalendarDays, Check, ChevronRight, QrCode } from 'lucide-react'

import { Reveal } from '@/shared/components/motion/reveal'

import type { LandingContent } from '@/i18n/messages'
import { links } from '../data'
import { HeroVisual } from './hero-visual'
import { Container, CtaLink } from './primitives'

export function Hero({ m }: { m: LandingContent['hero'] }) {
     return (
          <section
               aria-labelledby="hero-title"
               className="relative isolate overflow-hidden bg-brand-900 text-white"
          >
               {/* soft green glow behind the product, as on the guide cover */}
               <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_80%_40%,var(--color-glow-brand),transparent_70%)]"
               />
               <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-24">
                    <Reveal>
                         <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-saffron-300">
                              <QrCode aria-hidden className="size-3.5" />
                              {m.eyebrow}
                         </p>

                         <h1
                              id="hero-title"
                              className="mt-6 text-[2.625rem] leading-[1.02] font-bold tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]"
                         >
                              {m.titleLine1}
                              <br />
                              <span className="text-saffron-500">{m.titleLine2}</span>
                         </h1>

                         <p className="mt-6 max-w-xl text-base text-pretty text-white/75 sm:text-lg">
                              <span className="sm:hidden">{m.bodyShort}</span>
                              <span className="hidden sm:inline">{m.body}</span>
                         </p>

                         {/* Stacked full-width on mobile so the CTA sits in the thumb zone (guide L01) */}
                         <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                              <CtaLink
                                   href={links.signup}
                                   variant="saffron"
                                   size="lg"
                                   className="w-full sm:w-auto"
                              >
                                   {m.primaryCta}
                                   <ChevronRight aria-hidden />
                              </CtaLink>
                              <CtaLink
                                   href={links.demo}
                                   variant="outlineLight"
                                   size="lg"
                                   className="w-full sm:w-auto"
                              >
                                   <CalendarDays aria-hidden />
                                   {m.secondaryCta}
                              </CtaLink>
                         </div>

                         <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
                              {m.checks.map((c) => (
                                   <li key={c} className="inline-flex items-center gap-1.5">
                                        <Check aria-hidden className="size-4 text-brand-300" />
                                        {c}
                                   </li>
                              ))}
                         </ul>

                         <ul aria-label={m.paymentsLabel} className="mt-6 flex flex-wrap gap-2">
                              {m.payments.map((p) => (
                                   <li
                                        key={p}
                                        className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-semibold text-white/85"
                                   >
                                        {p}
                                   </li>
                              ))}
                         </ul>
                    </Reveal>

                    <Reveal delay={150}>
                         <HeroVisual label={m.visualLabel} m={m.visual} />
                    </Reveal>
               </Container>
          </section>
     )
}
