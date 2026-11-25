import type { ReactNode } from 'react'

import { format, localizeDigits, type SiteLocale } from '@/shared/i18n/site-locale'
import { cn } from '@/shared/lib/utils'

import { AuthShell } from '../../shared/auth-shell'
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
          <AuthShell
               homeLabel={t.home}
               meta={<span className="text-xs font-medium text-ink-3 sm:text-sm">{stepLabel}</span>}
               progress={
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
               }
          >
               {children}
          </AuthShell>
     )
}
