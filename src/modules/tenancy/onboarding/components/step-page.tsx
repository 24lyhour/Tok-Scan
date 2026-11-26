import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { TranslationsProvider } from '@/i18n/provider'
import type { Namespace } from '@/i18n/messages'
import { getTranslations } from '@/i18n/server'

import type { OnboardingContent } from '@/i18n/messages'
import { OnboardingShell } from './onboarding-shell'

/** Content sections that are a full page (they have title + metaTitle) */
type PageSection = {
     [K in keyof OnboardingContent]: OnboardingContent[K] extends {
          title: string
          metaTitle: string
     }
          ? K
          : never
}[keyof OnboardingContent]

/**
 * One onboarding step page: shell with "Step n of 4" + progress, the section's title and
 * subtitle, then the step's form. Loads the `onboarding` translations for client forms.
 */
export async function StepPage({
     step,
     section,
     namespaces = [],
     children,
}: {
     step: 1 | 2 | 3 | 4
     section: Exclude<PageSection, 'print' | 'dashboard'>
     /** Other translation namespaces the step's client form needs (e.g. 'auth' for sign-up) */
     namespaces?: Namespace[]
     children: ReactNode
}) {
     const { m, locale } = await getTranslations('onboarding')
     const copy = m[section]
     return (
          <TranslationsProvider namespaces={['onboarding', ...namespaces]}>
               <OnboardingShell step={step} locale={locale} m={m.shell}>
                    <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">
                         {copy.title}
                    </h1>
                    <p className="mt-1 mb-6 text-sm text-ink-3">{copy.subtitle}</p>
                    {children}
               </OnboardingShell>
          </TranslationsProvider>
     )
}

/** `generateMetadata` for any onboarding page: <title> from the section's metaTitle. */
export function stepMetadata(section: PageSection) {
     return async (): Promise<Metadata> => {
          const { m } = await getTranslations('onboarding')
          return { title: m[section].metaTitle }
     }
}
