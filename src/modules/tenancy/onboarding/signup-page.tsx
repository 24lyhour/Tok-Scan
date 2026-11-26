import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { TranslationsProvider } from '@/i18n/provider'
import { getTranslations } from '@/i18n/server'

import { OnboardingShell } from './components/onboarding-shell'
import { SignupForm } from './components/signup-form'

const LOGIN_HREF = '/login'

/** Onboarding step 1 of 4 — create the owner's account (guide p.23, first screen). */
export async function SignupPage() {
     const payload = await getPayload({ config })
     const { user } = await payload.auth({ headers: await headers() })
     // Already signed in → continue where onboarding left off
     if (user) redirect('/onboarding/organization')

     const { m, locale } = await getTranslations('onboarding')

     return (
          <TranslationsProvider namespaces={['onboarding']}>
               <OnboardingShell step={1} locale={locale} m={m.shell}>
                    <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">
                         {m.signup.title}
                    </h1>
                    <p className="mt-1 mb-6 text-sm text-ink-3">{m.signup.subtitle}</p>
                    <SignupForm loginHref={LOGIN_HREF} />
               </OnboardingShell>
          </TranslationsProvider>
     )
}

export async function signupMetadata() {
     const { t } = await getTranslations('onboarding')
     return { title: t('signup.metaTitle') }
}
