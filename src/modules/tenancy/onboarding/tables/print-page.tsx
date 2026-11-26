import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { buildTableQrUrl, qrSvg } from '@/modules/tables'
import { getTranslations } from '@/i18n/server'
import { Logo } from '@/shared/components/brand/logo'
import { interpolate, localizeDigits } from '@/shared/i18n/format'

import { DEFAULT_BRAND_COLOR } from '../../collections/organizations/constants'
import { stepMetadata } from '../components/step-page'
import { onboardingRoutes, STEP_PATHS } from '../routes'
import { getPublicOrigin, requireStep } from '../server/context'
import { PrintButton } from './print-button'

/**
 * Printable table QR cards — one A6 card per table (guide p.15 "table stand").
 * QR codes are made on the server as SVG, so the sheet prints sharp at any size.
 */
export async function PrintQrPage() {
     const { organization, tables } = await requireStep('tables')
     if (!organization || tables.length === 0) redirect(STEP_PATHS.tables)

     const { m, locale } = await getTranslations('onboarding')
     const common = (await getTranslations('common')).m
     const origin = await getPublicOrigin()
     const brand = organization.brand?.primaryColor ?? DEFAULT_BRAND_COLOR

     const cards = await Promise.all(
          tables.map(async (t) => ({
               id: t.id,
               label: t.label,
               zone: t.zone,
               svg: await qrSvg(buildTableQrUrl(origin, organization.slug, t.label, t.qrKey)),
          })),
     )

     return (
          <div className="min-h-dvh bg-paper print:bg-white">
               {/* A6 pages, no margins — the browser's print dialog picks this up */}
               <style>{'@page { size: A6; margin: 0 }'}</style>

               <header className="mx-auto max-w-5xl px-4 py-6 print:hidden">
                    <Link
                         href={onboardingRoutes.tables}
                         className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink"
                    >
                         <ArrowLeft aria-hidden className="size-4" />
                         {common.actions.back}
                    </Link>
                    <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                         <div>
                              <h1 className="text-2xl font-bold tracking-tight text-ink">
                                   {m.print.title}
                              </h1>
                              <p className="mt-1 text-sm text-ink-3">
                                   {interpolate(m.print.subtitle, {
                                        count: localizeDigits(cards.length, locale),
                                   })}
                              </p>
                         </div>
                         <PrintButton label={m.print.print} />
                    </div>
                    <p className="mt-3 text-xs text-ink-3">{m.print.tip}</p>
               </header>

               <main className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 pb-10 sm:grid-cols-2 lg:grid-cols-3 print:block print:max-w-none print:p-0">
                    {cards.map((card) => (
                         <article
                              key={card.id}
                              className="flex aspect-[105/148] flex-col items-center overflow-hidden rounded-2xl border border-line bg-white text-center print:h-[148mm] print:w-[105mm] print:break-after-page print:rounded-none print:border-0"
                         >
                              <div className="h-3 w-full" style={{ backgroundColor: brand }} />
                              <p className="mt-6 px-6 text-lg font-bold text-ink">
                                   {organization.name}
                              </p>
                              <p className="mt-1 text-sm font-medium text-ink-2">
                                   {m.print.scanToOrder}
                              </p>
                              <div
                                   className="mt-5 w-[62%] [&_svg]:h-auto [&_svg]:w-full"
                                   // SVG made by the qrcode library from our own URL — no user HTML
                                   dangerouslySetInnerHTML={{ __html: card.svg }}
                              />
                              <p className="tabular mt-5 text-4xl font-extrabold tracking-tight text-ink">
                                   {card.label}
                              </p>
                              {card.zone && <p className="text-xs text-ink-3">{card.zone}</p>}
                              <p className="mt-auto mb-5 flex items-center gap-1.5 text-[0.6875rem] text-ink-3">
                                   {common.poweredBy} <Logo size="sm" tagline={false} />
                                   <span className="sr-only">tok-scan</span>
                              </p>
                         </article>
                    ))}
               </main>
          </div>
     )
}

export const printQrMetadata = stepMetadata('print')
