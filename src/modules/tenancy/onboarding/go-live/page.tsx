import { Printer } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getTranslations } from '@/i18n/server'
import { formatDate, interpolate, localizeDigits } from '@/shared/i18n/format'

import { AuthShell } from '../../shared/auth-shell'
import { stepMetadata } from '../components/step-page'
import { onboardingRoutes, STEP_PATHS } from '../routes'
import { getOnboardingContext } from '../server/context'
import { goLiveRows } from './checklist'
import { ChecklistCard } from './checklist-card'

/**
 * Owner dashboard, first version: the "Get <restaurant> live" checklist (guide p.22).
 * Owners who haven't finished onboarding are sent back to their step.
 */
export async function GoLivePage() {
     const ctx = await getOnboardingContext()
     if (ctx.step !== 'done' || !ctx.organization) redirect(STEP_PATHS[ctx.step])
     const { organization, outlet, tables } = ctx

     const { m, locale } = await getTranslations('onboarding')
     const common = (await getTranslations('common')).m
     const copy = m.dashboard

     return (
          <AuthShell homeLabel={common.home}>
               <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">
                    {interpolate(copy.title, { name: organization.name })}
               </h1>
               <p className="mt-1 text-sm text-ink-3">{copy.subtitle}</p>
               {organization.trialEndsAt && (
                    <p className="mt-3 inline-flex w-fit rounded-full bg-saffron-50 px-3 py-1 text-xs font-semibold text-ink">
                         {interpolate(copy.trial, {
                              date: formatDate(organization.trialEndsAt, locale),
                         })}
                    </p>
               )}

               <div className="mt-6">
                    <ChecklistCard
                         rows={goLiveRows(ctx)}
                         title={m.tables.checklistTitle}
                         m={copy}
                         locale={locale}
                    />
               </div>

               {outlet && (
                    <p className="mt-4 text-sm text-ink-2">
                         {interpolate(copy.outletLine, {
                              outlet: outlet.name,
                              tables: localizeDigits(tables.length, locale),
                         })}
                    </p>
               )}

               <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-xs leading-relaxed text-ink-2">
                    {copy.approvalNote}
               </p>

               <div className="mt-auto pt-8">
                    <Link
                         href={onboardingRoutes.printQr}
                         className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-white text-[0.9375rem] font-semibold text-ink hover:bg-paper"
                    >
                         <Printer aria-hidden className="size-4" />
                         {copy.printQr}
                    </Link>
               </div>
          </AuthShell>
     )
}

export const goLiveMetadata = stepMetadata('dashboard')
