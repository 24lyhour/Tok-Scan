import {
     ArrowRight,
     Banknote,
     ChartColumn,
     Check,
     ChefHat,
     CookingPot,
     MapPin,
     MonitorSmartphone,
     Plus,
     QrCode,
     ScanLine,
     Split,
     Store,
     type LucideIcon,
} from 'lucide-react'

import { Logo } from '@/shared/components/brand/logo'
import { Reveal } from '@/shared/components/motion/reveal'
import { interpolate, localizeDigits, plural } from '@/shared/i18n/format'
import type { Locale } from '@/shared/i18n/locales'
import { cn } from '@/shared/lib/utils'

import type { LandingContent } from '@/i18n/messages'
import { customerNames, featureIds, footerColumns, links, sampleOutlets, stepIds } from '../data'
import { FakeQr } from './fake-qr'
import { Container, CtaLink, Eyebrow, SectionHeading } from './primitives'

/* ───────────────────────────── Social proof ───────────────────────────── */

export function SocialProof({ m }: { m: LandingContent['socialProof'] }) {
     return (
          <section aria-label={m.region} className="border-b border-line bg-white py-8">
               <Reveal>
                    <Container>
                         <p className="text-center text-[0.6875rem] font-semibold tracking-[0.18em] text-ink-3 uppercase">
                              {m.label}
                         </p>
                         <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                              {customerNames.map((name) => (
                                   <li
                                        key={name}
                                        className="text-base font-semibold tracking-tight text-ink-3"
                                   >
                                        {name}
                                   </li>
                              ))}
                         </ul>
                    </Container>
               </Reveal>
          </section>
     )
}

/* ───────────────────────────── How it works ───────────────────────────── */

// Keyed by step id — the same ids as `how.steps` in content.ts
const stepArt: Record<(typeof stepIds)[number], { icon: LucideIcon; tone: string; qr?: boolean }> =
     {
          scan: { icon: ScanLine, tone: 'bg-brand-50 text-brand-700', qr: true },
          cook: { icon: ChefHat, tone: 'bg-progress/10 text-progress' },
          pay: { icon: QrCode, tone: 'bg-khqr/10 text-khqr' },
     }

export function HowItWorks({ m, locale }: { m: LandingContent['how']; locale: Locale }) {
     return (
          <section id="how-it-works" aria-labelledby="how-title" className="py-20 sm:py-24">
               <Container>
                    <SectionHeading
                         id="how-title"
                         eyebrow={m.eyebrow}
                         title={m.title}
                         body={m.body}
                    />
                    <ol className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
                         {stepIds.map((id, i) => {
                              const step = m.steps[id]
                              const art = stepArt[id]
                              const Icon = art.icon
                              return (
                                   <Reveal
                                        as="li"
                                        delay={i * 100}
                                        key={id}
                                        className="overflow-hidden rounded-[14px] border border-line bg-white"
                                   >
                                        <div className="flex h-36 items-center justify-center bg-paper">
                                             {art.qr ? (
                                                  <FakeQr
                                                       seed={3}
                                                       className="size-24 rounded-md ring-8 ring-white"
                                                  />
                                             ) : (
                                                  <span
                                                       className={cn(
                                                            'inline-flex size-16 items-center justify-center rounded-2xl',
                                                            art.tone,
                                                       )}
                                                  >
                                                       <Icon aria-hidden className="size-8" />
                                                  </span>
                                             )}
                                        </div>
                                        <div className="p-5">
                                             <p className="flex items-center gap-2 text-base font-semibold text-ink">
                                                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                                                       {localizeDigits(i + 1, locale)}
                                                  </span>
                                                  {step.title}
                                             </p>
                                             <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                                  {step.body}
                                             </p>
                                        </div>
                                   </Reveal>
                              )
                         })}
                    </ol>
               </Container>
          </section>
     )
}

/* ───────────────────────────── Features ───────────────────────────── */

// Keyed by feature id — the same ids as `features.items` in content.ts
const featureIcons: Record<(typeof featureIds)[number], LucideIcon> = {
     menu: MonitorSmartphone,
     kitchen: CookingPot,
     split: Split,
     khqr: QrCode,
     outlets: Store,
     reports: ChartColumn,
}

export function Features({ m }: { m: LandingContent['features'] }) {
     return (
          <section
               id="features"
               aria-labelledby="features-title"
               className="border-y border-line bg-white py-20 sm:py-24"
          >
               <Container>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                         <SectionHeading
                              id="features-title"
                              align="left"
                              eyebrow={m.eyebrow}
                              title={m.title}
                         />
                         <a
                              href="#pricing"
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
                         >
                              {m.compare} <ArrowRight aria-hidden className="size-4" />
                         </a>
                    </div>
                    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                         {featureIds.map((id, i) => {
                              const f = m.items[id]
                              const Icon = featureIcons[id]
                              return (
                                   <Reveal as="li" key={id} delay={(i % 3) * 80}>
                                        {/* inner card keeps its own hover transition separate from the reveal */}
                                        <div className="h-full rounded-[14px] border border-line bg-paper/60 p-5 transition-colors duration-200 hover:border-brand-300 hover:bg-white">
                                             <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                                                  <Icon aria-hidden className="size-5" />
                                             </span>
                                             <h3 className="mt-4 font-semibold text-ink">
                                                  {f.title}
                                             </h3>
                                             <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                                                  {f.body}
                                             </p>
                                        </div>
                                   </Reveal>
                              )
                         })}
                    </ul>
               </Container>
          </section>
     )
}

/* ───────────────────────────── For chains ───────────────────────────── */

export function Chains({ m, locale }: { m: LandingContent['chains']; locale: Locale }) {
     return (
          <section id="chains" aria-labelledby="chains-title" className="py-20 sm:py-24">
               <Container className="grid items-center gap-12 lg:grid-cols-2">
                    <Reveal>
                         <Eyebrow>{m.eyebrow}</Eyebrow>
                         <h2
                              id="chains-title"
                              className="mt-3 text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl"
                         >
                              {m.title}
                         </h2>
                         <p className="mt-4 text-base text-pretty text-ink-2 sm:text-lg">
                              {m.body}
                         </p>
                         <ul className="mt-6 space-y-3">
                              {m.points.map((p) => (
                                   <li key={p} className="flex gap-3 text-sm text-ink">
                                        <Check
                                             aria-hidden
                                             className="mt-0.5 size-4 shrink-0 text-brand-500"
                                        />
                                        {p}
                                   </li>
                              ))}
                         </ul>
                    </Reveal>

                    {/* Organization → outlets diagram (guide p.20) */}
                    <Reveal
                         delay={120}
                         className="rounded-[14px] border border-line bg-white p-4 sm:p-6"
                         aria-label={m.diagramLabel}
                    >
                         <div className="rounded-xl bg-ink px-4 py-3 text-white">
                              <p className="text-sm font-semibold">{m.platform}</p>
                              <p className="text-xs text-white/60">{m.platformSub}</p>
                         </div>
                         <div aria-hidden className="mx-auto h-4 w-px bg-line" />
                         <div className="rounded-xl bg-brand-700 px-4 py-3 text-white">
                              <p className="text-sm font-semibold">{m.organization}</p>
                              <p className="text-xs text-white/70">{m.organizationSub}</p>
                         </div>
                         <div aria-hidden className="mx-auto h-4 w-px bg-line" />
                         <ul className="grid gap-3 sm:grid-cols-3">
                              {sampleOutlets.map((o) => (
                                   <li
                                        key={o.id}
                                        className="rounded-xl border border-brand-100 p-3"
                                   >
                                        <p className="flex items-center justify-between text-sm font-semibold text-ink">
                                             {o.name}
                                             <MapPin
                                                  aria-hidden
                                                  className="size-4 text-brand-500"
                                             />
                                        </p>
                                        <p className="text-xs text-ink-3">{m.areas[o.id]}</p>
                                        <p className="mt-3 text-xs text-ink-2 tabular">
                                             {plural(locale, o.tables, m.tables)} ·{' '}
                                             {plural(locale, o.staff, m.staff)}
                                        </p>
                                   </li>
                              ))}
                         </ul>
                         <p className="mt-4 flex items-start gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
                              <Check aria-hidden className="mt-px size-3.5 shrink-0" />
                              {m.note}
                         </p>
                    </Reveal>
               </Container>
          </section>
     )
}

/* ───────────────────────────── FAQ ───────────────────────────── */

export function Faq({ m }: { m: LandingContent['faq'] }) {
     return (
          <section
               id="faq"
               aria-labelledby="faq-title"
               className="border-t border-line bg-white py-20 sm:py-24"
          >
               <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
                    <Reveal>
                         <Eyebrow>{m.eyebrow}</Eyebrow>
                         <h2
                              id="faq-title"
                              className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
                         >
                              {m.title}
                         </h2>
                         <p className="mt-4 text-ink-2">
                              {m.curious}{' '}
                              <a
                                   href={links.telegram}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="font-semibold text-brand-700 hover:underline"
                              >
                                   Telegram
                              </a>
                         </p>
                    </Reveal>
                    <Reveal delay={120} className="divide-y divide-line border-y border-line">
                         {m.items.map((item) => (
                              <details key={item.q} className="group">
                                   <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-semibold text-ink [&::-webkit-details-marker]:hidden">
                                        {item.q}
                                        <Plus
                                             aria-hidden
                                             className="size-5 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-45"
                                        />
                                   </summary>
                                   <p className="-mt-1 pb-5 text-sm leading-relaxed text-ink-2">
                                        {item.a}
                                   </p>
                              </details>
                         ))}
                    </Reveal>
               </Container>
          </section>
     )
}

/* ───────────────────────────── Final CTA ───────────────────────────── */

export function FinalCta({ m }: { m: LandingContent['finalCta'] }) {
     return (
          <section id="contact" aria-labelledby="cta-title" className="py-16 sm:py-20">
               <Container>
                    <Reveal className="relative isolate overflow-hidden rounded-3xl bg-brand-700 px-6 py-10 sm:px-12 sm:py-14">
                         <div
                              aria-hidden
                              className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_100%_0%,var(--color-glow-saffron),transparent_70%)]"
                         />
                         <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                              <div>
                                   <h2
                                        id="cta-title"
                                        className="text-2xl font-bold tracking-[-0.02em] text-balance text-white sm:text-3xl"
                                   >
                                        {m.title}
                                   </h2>
                                   <p className="mt-2 text-white/75">{m.body}</p>
                              </div>
                              <div className="flex flex-col gap-3 sm:flex-row">
                                   <CtaLink href={links.signup} variant="saffron" size="lg">
                                        {m.primary}
                                   </CtaLink>
                                   <CtaLink href={links.demo} variant="outlineLight" size="lg">
                                        {m.secondary}
                                   </CtaLink>
                              </div>
                         </div>
                    </Reveal>
               </Container>
          </section>
     )
}

/* ───────────────────────────── Footer ───────────────────────────── */

export function SiteFooter({ m }: { m: LandingContent['footer'] }) {
     return (
          <footer className="bg-brand-900 text-white">
               <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
                    <div>
                         <Logo inverted />
                         <p className="mt-4 max-w-xs text-sm text-white/60">{m.blurb}</p>
                         <p className="mt-4 inline-flex items-center gap-2 text-xs text-white/50">
                              <Banknote aria-hidden className="size-4" />
                              {m.payments}
                         </p>
                    </div>
                    {footerColumns.map((col) => (
                         <nav key={col.id} aria-label={m.columns[col.id]}>
                              <p className="text-sm font-semibold">{m.columns[col.id]}</p>
                              <ul className="mt-3 space-y-2">
                                   {col.links.map((l) => (
                                        <li key={l.id}>
                                             <a
                                                  href={l.href}
                                                  {...(l.href.startsWith('http')
                                                       ? {
                                                              target: '_blank',
                                                              rel: 'noopener noreferrer',
                                                         }
                                                       : {})}
                                                  className="text-sm text-white/60 transition-colors hover:text-white"
                                             >
                                                  {m.links[l.id]}
                                             </a>
                                        </li>
                                   ))}
                              </ul>
                         </nav>
                    ))}
               </Container>
               <div className="border-t border-white/10">
                    <Container className="flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
                         <p>{interpolate(m.rights, { year: new Date().getFullYear() })}</p>
                         <p>{m.tagline}</p>
                    </Container>
               </div>
          </footer>
     )
}
