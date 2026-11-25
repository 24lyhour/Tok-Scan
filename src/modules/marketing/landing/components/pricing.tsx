'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'

import { useTranslations } from '@/i18n/client'
import { Reveal } from '@/shared/components/motion/reveal'
import { format } from '@/shared/i18n/site-locale'
import { cn } from '@/shared/lib/utils'

import {
     type BillingCycle,
     type LandingContent,
     type Plan,
     plans,
     yearlyMonthsCharged,
} from '../content'
import { Container, CtaLink, SectionHeading } from './primitives'

type PricingText = LandingContent['pricing']

function priceFor(plan: Plan, cycle: BillingCycle) {
     if (plan.monthly === null) return null
     if (cycle === 'monthly') return { perMonth: plan.monthly, perYear: null }
     const perYear = plan.monthly * yearlyMonthsCharged
     return { perMonth: Math.round(perYear / 12), perYear }
}

function PlanCard({
     plan,
     cycle,
     index,
     t,
}: {
     plan: Plan
     cycle: BillingCycle
     index: number
     t: PricingText
}) {
     const price = priceFor(plan, cycle)
     const text = t.plans[plan.id]
     const isPrimary = plan.highlight === 'primary'
     const isPremium = plan.highlight === 'premium'

     return (
          <Reveal
               as="li"
               delay={index * 80}
               className={cn(
                    'relative flex flex-col rounded-[14px] border bg-white p-5 sm:p-6',
                    isPrimary && 'border-brand-700 ring-1 ring-brand-700',
                    isPremium && 'border-saffron-500 bg-saffron-50/40 ring-1 ring-saffron-500',
                    !plan.highlight && 'border-line',
               )}
          >
               {text.badge && (
                    <span
                         className={cn(
                              'absolute -top-3 left-5 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold',
                              isPremium ? 'bg-saffron-500 text-ink' : 'bg-brand-700 text-white',
                         )}
                    >
                         {text.badge}
                    </span>
               )}

               <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
               <p className="mt-1 text-sm text-ink-3">{text.limits}</p>

               <p className="mt-5 flex items-baseline gap-1">
                    {price ? (
                         <>
                              <span className="tabular text-4xl font-bold tracking-tight text-ink">
                                   ${price.perMonth}
                              </span>
                              <span className="text-sm text-ink-3">{t.perMonth}</span>
                         </>
                    ) : (
                         <span className="text-4xl font-bold tracking-tight text-ink">
                              {t.custom}
                         </span>
                    )}
               </p>
               <p className="mt-1 min-h-5 text-xs text-ink-3">
                    {price?.perYear ? (
                         <span className="tabular">
                              {format(t.billedYearly, { amount: price.perYear })}
                         </span>
                    ) : price ? (
                         t.billedMonthly
                    ) : (
                         t.volume
                    )}
               </p>

               <ul className="mt-5 flex-1 space-y-2.5">
                    {text.features.map((f) => (
                         <li key={f} className="flex gap-2.5 text-sm text-ink">
                              <Check
                                   aria-hidden
                                   className="mt-0.5 size-4 shrink-0 text-brand-500"
                              />
                              {f}
                         </li>
                    ))}
               </ul>

               <CtaLink
                    href={plan.href}
                    variant={
                         isPremium
                              ? 'saffron'
                              : isPrimary || plan.id === 'chain'
                                ? 'primary'
                                : 'outline'
                    }
                    className="mt-6 w-full"
               >
                    {text.cta}
               </CtaLink>
          </Reveal>
     )
}

export function Pricing() {
     const t = useTranslations('landing').m.pricing
     const [cycle, setCycle] = useState<BillingCycle>('monthly')

     const cycles: { id: BillingCycle; label: string; note?: string }[] = [
          { id: 'monthly', label: t.monthly },
          { id: 'yearly', label: t.yearly, note: t.yearlyNote },
     ]

     return (
          <section id="pricing" aria-labelledby="pricing-title" className="py-20 sm:py-24">
               <Container>
                    <SectionHeading
                         id="pricing-title"
                         eyebrow={t.eyebrow}
                         title={t.title}
                         body={t.body}
                    />

                    <div className="mt-8 flex justify-center">
                         <div
                              role="radiogroup"
                              aria-label={t.billingPeriod}
                              className="inline-flex rounded-xl bg-muted p-1"
                         >
                              {cycles.map((c) => {
                                   const active = cycle === c.id
                                   return (
                                        <button
                                             key={c.id}
                                             type="button"
                                             role="radio"
                                             aria-checked={active}
                                             onClick={() => setCycle(c.id)}
                                             className={cn(
                                                  'inline-flex min-h-9 items-center gap-2 rounded-[0.625rem] px-4 text-sm font-semibold transition-colors duration-[120ms]',
                                                  active
                                                       ? 'bg-white text-ink shadow-sm'
                                                       : 'text-ink-2 hover:text-ink',
                                             )}
                                        >
                                             {c.label}
                                             {c.note && (
                                                  <span className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[0.625rem] text-brand-700">
                                                       {c.note}
                                                  </span>
                                             )}
                                        </button>
                                   )
                              })}
                         </div>
                    </div>

                    <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                         {plans.map((plan, index) => (
                              <PlanCard
                                   key={plan.id}
                                   plan={plan}
                                   cycle={cycle}
                                   index={index}
                                   t={t}
                              />
                         ))}
                    </ul>

                    <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-3">
                         {t.note}
                    </p>
               </Container>
          </section>
     )
}
