'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/shared/lib/utils'

import { type BillingCycle, type Plan, plans, yearlyMonthsCharged } from '../content'
import { Container, CtaLink, SectionHeading } from './primitives'

const cycles: { id: BillingCycle; label: string; note?: string }[] = [
     { id: 'monthly', label: 'Monthly' },
     { id: 'yearly', label: 'Yearly', note: '2 months free' },
]

function priceFor(plan: Plan, cycle: BillingCycle) {
     if (plan.monthly === null) return null
     if (cycle === 'monthly') return { perMonth: plan.monthly, perYear: null }
     const perYear = plan.monthly * yearlyMonthsCharged
     return { perMonth: Math.round(perYear / 12), perYear }
}

function PlanCard({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
     const price = priceFor(plan, cycle)
     const isPrimary = plan.highlight === 'primary'
     const isPremium = plan.highlight === 'premium'

     return (
          <li
               className={cn(
                    'relative flex flex-col rounded-[14px] border bg-white p-5 sm:p-6',
                    isPrimary && 'border-brand-700 ring-1 ring-brand-700',
                    isPremium && 'border-saffron-500 bg-saffron-50/40 ring-1 ring-saffron-500',
                    !plan.highlight && 'border-line',
               )}
          >
               {plan.badge && (
                    <span
                         className={cn(
                              'absolute -top-3 left-5 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold',
                              isPremium ? 'bg-saffron-500 text-ink' : 'bg-brand-700 text-white',
                         )}
                    >
                         {plan.badge}
                    </span>
               )}

               <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
               <p className="mt-1 text-sm text-ink-3">{plan.limits}</p>

               <p className="mt-5 flex items-baseline gap-1">
                    {price ? (
                         <>
                              <span className="tabular text-4xl font-bold tracking-tight text-ink">
                                   ${price.perMonth}
                              </span>
                              <span className="text-sm text-ink-3">/ month</span>
                         </>
                    ) : (
                         <span className="text-4xl font-bold tracking-tight text-ink">Custom</span>
                    )}
               </p>
               <p className="mt-1 h-5 text-xs text-ink-3">
                    {price?.perYear ? (
                         <span className="tabular">${price.perYear} billed yearly</span>
                    ) : price ? (
                         'Billed monthly'
                    ) : (
                         'Volume pricing'
                    )}
               </p>

               <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
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
                    {plan.cta}
               </CtaLink>
          </li>
     )
}

export function Pricing() {
     const [cycle, setCycle] = useState<BillingCycle>('monthly')

     return (
          <section id="pricing" aria-labelledby="pricing-title" className="py-20 sm:py-24">
               <Container>
                    <SectionHeading
                         id="pricing-title"
                         eyebrow="Pricing"
                         title="Simple plans per organization"
                         body="Every plan starts with a 14-day free trial. Add outlets as you grow."
                    />

                    <div className="mt-8 flex justify-center">
                         <div
                              role="radiogroup"
                              aria-label="Billing period"
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
                                                  'inline-flex h-9 items-center gap-2 rounded-[0.625rem] px-4 text-sm font-semibold transition-colors duration-[120ms]',
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
                         {plans.map((plan) => (
                              <PlanCard key={plan.id} plan={plan} cycle={cycle} />
                         ))}
                    </ul>

                    <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-3">
                         Prices in USD. Guest payments (KHQR, ABA, card, cash) go straight to your
                         own merchant account — tok·scan only bills the subscription.
                    </p>
               </Container>
          </section>
     )
}
