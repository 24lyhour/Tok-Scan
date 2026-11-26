import {
     CircleCheck,
     ClipboardList,
     Clock,
     ReceiptText,
     UserRound,
     Wallet,
     type LucideIcon,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { getTranslations } from '@/i18n/server'
import { TableStatusGrid } from '@/modules/tables'
import { ChecklistCard } from '@/modules/tenancy'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Note } from '@/shared/components/ui/note'
import { StatCard } from '@/shared/components/ui/stat-card'
import { formatMoney, interpolate, localizeDigits } from '@/shared/i18n/format'

import { APP_ROUTES } from '@/shared/config/app-routes'

import { getWorkspaceContext } from '../server/context'

type KpiId = 'revenue' | 'orders' | 'pending' | 'completed' | 'customers' | 'avgTicket'

/** Stat cards (guide p.8). Zero until the Orders module records sales. */
const KPIS: { id: KpiId; icon: LucideIcon; money?: boolean }[] = [
     { id: 'revenue', icon: Wallet, money: true },
     { id: 'orders', icon: ClipboardList },
     { id: 'pending', icon: Clock },
     { id: 'completed', icon: CircleCheck },
     { id: 'customers', icon: UserRound },
     { id: 'avgTicket', icon: ReceiptText, money: true },
]

/**
 * Owner dashboard (guide p.8): the "Get <restaurant> live" checklist until setup is finished
 * (p.22), today's numbers, and the outlet's tables live. The app layout (AppShell) adds the
 * sidebar and top bar. Built from shared pieces:
 * ChecklistCard · StatCard · Card · TableStatusGrid · Note.
 */
export async function DashboardPage() {
     const ctx = await getWorkspaceContext()
     const { m, locale } = await getTranslations('workspace')
     const onboarding = (await getTranslations('onboarding', locale)).m
     const common = (await getTranslations('common', locale)).m
     const copy = m.dashboard
     const n = (value: number) => localizeDigits(value, locale)
     const setupDone = ctx.rows.every((r) => r.done)

     return (
          <div className="mx-auto max-w-6xl space-y-5">
               {!setupDone && (
                    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                         <ChecklistCard
                              rows={ctx.rows}
                              title={interpolate(onboarding.goLive.title, {
                                   name: ctx.organization.name,
                              })}
                              m={onboarding.goLive}
                              locale={locale}
                              soonLabel={common.states.soon}
                         />
                         <Note className="h-fit">{onboarding.goLive.approvalNote}</Note>
                    </section>
               )}

               <section aria-label={m.nav.items.dashboard}>
                    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                         {KPIS.map(({ id, icon, money }) => (
                              <li key={id}>
                                   <StatCard
                                        label={copy.kpi[id]}
                                        icon={icon}
                                        value={money ? formatMoney(0) : n(0)}
                                        className="h-full"
                                   />
                              </li>
                         ))}
                    </ul>
                    <p className="mt-2 text-xs text-ink-3">{copy.noOrders}</p>
               </section>

               <Card className="gap-4 rounded-2xl py-5 ring-line">
                    <CardHeader className="px-5">
                         <CardTitle className="text-base font-semibold text-ink">
                              {copy.liveTables}
                         </CardTitle>
                         <CardAction className="flex items-center gap-3 text-xs">
                              <span className="text-ink-3">
                                   {interpolate(copy.inUse, {
                                        used: n(0),
                                        total: n(ctx.tables.length),
                                   })}
                              </span>
                              <Link
                                   href={APP_ROUTES.tables}
                                   className="font-semibold text-brand-700 hover:underline"
                              >
                                   {copy.editTables}
                              </Link>
                         </CardAction>
                    </CardHeader>
                    <CardContent className="px-5">
                         <TableStatusGrid
                              locale={locale}
                              statusLabels={copy.legend}
                              tables={ctx.tables.map((t) => ({
                                   id: t.id,
                                   number: t.number,
                                   label: t.label,
                                   zone: t.zone,
                                   status: 'available',
                              }))}
                         />
                    </CardContent>
               </Card>
          </div>
     )
}

export async function dashboardMetadata(): Promise<Metadata> {
     const { m } = await getTranslations('workspace')
     return { title: m.nav.items.dashboard }
}
