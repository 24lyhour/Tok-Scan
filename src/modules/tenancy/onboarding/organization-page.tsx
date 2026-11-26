import config from '@payload-config'
import { CircleCheck } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { getTranslations } from '@/i18n/server'

import { OnboardingShell } from './components/onboarding-shell'

/**
 * Onboarding step 2 of 4 — placeholder until the organization form is built
 * (business name, slug, logo, brand colour, business type — guide p.23, second screen).
 */
export async function OrganizationStepPage() {
     const payload = await getPayload({ config })
     const { user } = await payload.auth({ headers: await headers() })
     if (!user) redirect('/signup')

     const { m, t, locale } = await getTranslations('onboarding')
     const name = (user as { name?: string | null }).name || user.email

     return (
          <OnboardingShell step={2} locale={locale} m={m.shell}>
               <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <CircleCheck aria-hidden className="size-6" />
               </span>
               <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">
                    {m.organization.title}
               </h1>
               <p className="mt-3 font-medium text-ink">{t('organization.welcome', { name })}</p>
               <p className="mt-2 text-sm leading-relaxed text-ink-2">
                    {m.organization.comingNext}
               </p>
               <div className="mt-auto pt-8">
                    <Link
                         href="/"
                         className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-line bg-white text-[0.9375rem] font-semibold text-ink hover:bg-paper"
                    >
                         {m.organization.backHome}
                    </Link>
               </div>
          </OnboardingShell>
     )
}

export async function organizationMetadata() {
     const { t } = await getTranslations('onboarding')
     return { title: t('organization.metaTitle') }
}
