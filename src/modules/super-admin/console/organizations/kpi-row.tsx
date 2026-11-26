import { Building2, ChartColumn, Clock, MapPin, Wallet } from 'lucide-react'

import { StatCard } from '@/shared/components/ui/stat-card'
import { interpolate, localizeDigits, plural } from '@/shared/i18n/format'
import type { Locale } from '@/shared/i18n/locales'
import { cn } from '@/shared/lib/utils'

import type { ConsoleContent } from '@/i18n/messages'
import type { OrganizationsData } from './data'

/** The five numbers on top of the console (guide p.27). MRR / GMV arrive with billing. */
export function KpiRow({
     kpis,
     m,
     locale,
}: {
     kpis: OrganizationsData['kpis']
     m: ConsoleContent
     locale: Locale
}) {
     const n = (value: number) => localizeDigits(value, locale)
     const note = (text: string, tone: 'up' | 'down' | 'muted' = 'muted') => (
          <p
               className={cn(
                    'text-xs font-medium',
                    tone === 'up' && 'text-success',
                    tone === 'down' && 'text-error',
                    tone === 'muted' && 'text-ink-3',
               )}
          >
               {tone === 'up' ? '↑ ' : tone === 'down' ? '↓ ' : ''}
               {text}
          </p>
     )
     const days = kpis.oldestPendingDays

     return (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
               <StatCard
                    label={m.kpi.active}
                    value={n(kpis.active)}
                    icon={Building2}
                    footer={note(
                         interpolate(m.kpi.thisMonth, { count: n(kpis.activeThisMonth) }),
                         kpis.activeThisMonth ? 'up' : 'muted',
                    )}
               />
               <StatCard label={m.kpi.outlets} value={n(kpis.outletsLive)} icon={MapPin} />
               <StatCard label={m.kpi.mrr} value="—" icon={Wallet} footer={note(m.kpi.soon)} />
               <StatCard label={m.kpi.gmv} value="—" icon={ChartColumn} footer={note(m.kpi.soon)} />
               <StatCard
                    label={m.kpi.pending}
                    value={n(kpis.pending)}
                    icon={Clock}
                    footer={
                         days === null
                              ? note(m.kpi.noneWaiting)
                              : note(
                                     interpolate(m.kpi.oldest, {
                                          days: plural(locale, days, m.kpi.days),
                                     }),
                                     'down',
                                )
                    }
               />
          </div>
     )
}
