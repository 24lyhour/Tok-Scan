import { Clock, Eye, Pencil, X } from 'lucide-react'
import Link from 'next/link'

import { OrgAvatar } from '@/shared/components/ui/org-avatar'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'
import { formatDate, formatTime, interpolate, localizeDigits } from '@/shared/i18n/format'
import type { Locale } from '@/shared/i18n/locales'

import type { ConsoleContent } from '@/i18n/messages'
import type { OrgDetail as Detail } from './data'
import { OrgStatusPill } from './org-status'
import { StatusActions } from './status-actions'

const hhmm = (value: string) => new Date(value).toTimeString().slice(0, 5)

/** Right-hand panel for the selected organization (guide p.27). */
export function OrgDetail({
     org,
     closeHref,
     m,
     soon,
     locale,
}: {
     org: Detail | null
     closeHref: string
     m: ConsoleContent
     soon: string
     locale: Locale
}) {
     const copy = m.detail
     if (!org) {
          return (
               <aside className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 p-6 text-center text-sm text-ink-3">
                    {copy.select}
               </aside>
          )
     }
     const n = (value: number) => localizeDigits(value, locale)
     const dateTime = (value: string) =>
          `${formatDate(value, locale)} ${formatTime(hhmm(value), locale)}`

     const facts: [string, string][] = [
          [copy.owner, org.ownerName],
          [copy.outletsTables, `${n(org.outlets)} / ${n(org.tables)}`],
          [copy.signedUp, dateTime(org.createdAt)],
          [copy.trialEnds, org.trialEndsAt ? formatDate(org.trialEndsAt, locale) : '—'],
     ]
     if (org.statusChangedAt) {
          facts.push([
               copy.lastChange,
               interpolate(copy.lastChangeBy, {
                    date: dateTime(org.statusChangedAt),
                    name: org.statusChangedBy ?? '—',
               }),
          ])
     }

     return (
          <aside className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
               <header className="flex items-start gap-3 border-b border-line p-4">
                    <OrgAvatar name={org.name} color={org.color} className="size-10 rounded-full" />
                    <div className="min-w-0 flex-1">
                         <p className="truncate font-bold text-ink">{org.name}</p>
                         <p className="truncate text-xs text-ink-3">
                              /r/{org.slug} · {m.table.trialPlan}
                         </p>
                    </div>
                    <OrgStatusPill status={org.status} label={m.status[org.status]} />
                    <Link
                         href={CONSOLE_ROUTES.editOrganization(org.id)}
                         aria-label={`${m.edit.open} · ${org.name}`}
                         title={m.edit.open}
                         className="-mt-1 flex size-8 items-center justify-center rounded-lg text-ink-3 hover:bg-paper hover:text-ink"
                    >
                         <Pencil aria-hidden className="size-4" />
                    </Link>
                    <Link
                         href={closeHref}
                         scroll={false}
                         aria-label={copy.close}
                         className="-mt-1 -mr-1 flex size-8 items-center justify-center rounded-lg text-ink-3 hover:bg-paper hover:text-ink"
                    >
                         <X aria-hidden className="size-4" />
                    </Link>
               </header>

               <section className="border-b border-line p-4">
                    <h2 className="text-sm font-semibold text-ink">{copy.verification}</h2>
                    <ul className="mt-2 space-y-1.5 text-sm">
                         {Object.values(copy.checks).map((label) => (
                              <li key={label} className="flex items-center justify-between gap-3">
                                   <span className="text-ink-2">{label}</span>
                                   <span
                                        title={soon}
                                        className="flex items-center gap-1 text-xs text-ink-3"
                                   >
                                        <Clock aria-hidden className="size-3.5" />
                                        {copy.notCollected}
                                   </span>
                              </li>
                         ))}
                    </ul>
               </section>

               <dl className="space-y-1.5 p-4 text-sm">
                    {facts.map(([label, value]) => (
                         <div key={label} className="flex items-baseline justify-between gap-3">
                              <dt className="text-ink-3">{label}</dt>
                              <dd className="tabular text-right font-semibold text-ink">{value}</dd>
                         </div>
                    ))}
               </dl>

               <p className="mx-4 mb-4 flex gap-2 rounded-xl bg-paper p-3 text-xs text-ink-2">
                    <Eye aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                    {copy.viewAsNote}
               </p>

               <div className="mt-auto">
                    <StatusActions id={org.id} name={org.name} status={org.status} />
               </div>
          </aside>
     )
}
