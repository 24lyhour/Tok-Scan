import Link from 'next/link'
import type { ReactNode } from 'react'

import { Logo } from '@/shared/components/brand/logo'
import { LanguageToggle } from '@/shared/components/i18n/language-toggle'
import { format, localizeDigits, type SiteLocale } from '@/shared/i18n/site-locale'
import { cn } from '@/shared/lib/utils'

import type { OnboardingContent } from '../content'

export const ONBOARDING_STEPS = 4

/**
 * Frame shared by every onboarding step (guide p.23): logo, "Step n of 4", 4-segment progress,
 * language switch, then a single centred card. Mobile: full-width, primary action at the bottom.
 */
export function OnboardingShell({
     step,
     locale,
     t,
     children,
}: {
     step: number
     locale: SiteLocale
     t: OnboardingContent['shell']
     children: ReactNode
}) {
     const stepLabel = format(t.step, {
          n: localizeDigits(step, locale),
          total: localizeDigits(ONBOARDING_STEPS, locale),
     })

     return (
          <div className="min-h-dvh bg-paper">
               <div className="mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col px-4 py-5 sm:py-10">
                    <header className="flex items-center justify-between gap-3">
                         <Link
                              href="/"
                              aria-label={t.home}
                              className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-brand-300"
                         >
                              <Logo size="sm" />
                         </Link>
                         <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-ink-3 sm:text-sm">
                                   {stepLabel}
                              </span>
                              <LanguageToggle />
                         </div>
                    </header>

                    <div
                         role="progressbar"
                         aria-label={t.progress}
                         aria-valuemin={1}
                         aria-valuemax={ONBOARDING_STEPS}
                         aria-valuenow={step}
                         aria-valuetext={stepLabel}
                         className="mt-4 grid grid-cols-4 gap-1.5"
                    >
                         {Array.from({ length: ONBOARDING_STEPS }, (_, i) => (
                              <span
                                   key={i}
                                   className={cn(
                                        'h-1 rounded-full transition-colors duration-[400ms]',
                                        i < step ? 'bg-brand-700' : 'bg-line',
                                   )}
                              />
                         ))}
                    </div>

                    <main className="mt-6 flex flex-1 flex-col rounded-3xl border border-line bg-white p-5 shadow-[0_12px_40px_-20px_rgb(22_24_29/0.18)] sm:mt-8 sm:p-8">
                         {children}
                    </main>
               </div>
          </div>
     )
}
