import { Bell, Search, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

import { TranslationsProvider } from '@/i18n/provider'
import { getTranslations } from '@/i18n/server'
import { AssistantWidget } from '@/modules/assistant'
import { authRoutes, LogoutButton } from '@/modules/tenancy'
import { SUPPORT } from '@/shared/config/contact'
import { formatDate, interpolate, localizeDigits } from '@/shared/i18n/format'

import { getWorkspaceContext } from '../server/context'
import { Sidebar } from './sidebar'
import { Switcher } from './switcher'

/**
 * The signed-in app frame (guide p.8 / p.24): dark sidebar with the switcher, menu, plan and
 * user; a top bar with section · date, page title, search, plan badge and notifications.
 * Every app page renders inside it: <AppShell title="Dashboard">…</AppShell>
 */
export async function AppShell({ title, children }: { title: string; children: ReactNode }) {
     const ctx = await getWorkspaceContext()
     const { m, locale } = await getTranslations('workspace')
     const common = (await getTranslations('common', locale)).m
     const n = (value: number) => localizeDigits(value, locale)
     const { organization, user, plan } = ctx
     const name = user.name || user.email

     const footer = (
          <>
               {/* Plan card */}
               <div className="rounded-xl border border-saffron-500/40 bg-saffron-500/10 px-3 py-2.5 text-xs">
                    <p className="flex items-center justify-between gap-2">
                         <span className="flex items-center gap-1 font-semibold text-saffron-300">
                              <Sparkles aria-hidden className="size-3.5" />
                              {interpolate(m.plan.trial, { plan: plan.name })}
                         </span>
                         {plan.limits && (
                              <span className="text-white/60">
                                   {interpolate(m.plan.outlets, {
                                        used: n(ctx.outlets.length),
                                        max: n(plan.limits.outlets),
                                   })}
                              </span>
                         )}
                    </p>
                    {organization.trialEndsAt && (
                         <p className="mt-1 text-white/60">
                              {interpolate(m.plan.ends, {
                                   date: formatDate(organization.trialEndsAt, locale),
                              })}
                              {' · '}
                              <span
                                   className="underline decoration-white/30"
                                   title={common.states.soon}
                              >
                                   {m.plan.choose}
                              </span>
                         </p>
                    )}
               </div>
               {/* User */}
               <div className="flex items-center gap-2.5 border-t border-white/10 px-1 pt-3">
                    <span
                         aria-hidden
                         className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white"
                    >
                         {initials(name)}
                    </span>
                    <span className="min-w-0 flex-1 text-xs">
                         <span className="block truncate text-sm font-semibold text-white">
                              {name}
                         </span>
                         <span className="block truncate text-white/60">
                              {interpolate(m.user.role, {
                                   role: m.switcher.roles[ctx.role],
                                   org: organization.name,
                              })}
                         </span>
                    </span>
                    <LogoutButton
                         label={common.actions.logOut}
                         loginHref={authRoutes.login}
                         className="text-white/70 hover:bg-white/10 hover:text-white"
                    />
               </div>
          </>
     )

     return (
          <TranslationsProvider namespaces={['workspace', 'assistant']}>
               <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
                    <Sidebar
                         qrUnlocked={ctx.qrUnlocked}
                         switcher={
                              <Switcher
                                   organizations={ctx.organizations}
                                   outlets={ctx.outlets}
                                   maxOutlets={plan.limits?.outlets ?? null}
                              />
                         }
                         footer={footer}
                    />

                    <div className="flex min-w-0 flex-col">
                         <header className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-3 sm:px-6">
                              <div className="min-w-0 flex-1">
                                   <p className="text-xs text-ink-3">
                                        {m.nav.groups.overview} ·{' '}
                                        {interpolate(m.topbar.today, {
                                             date: formatDate(new Date(), locale),
                                        })}
                                   </p>
                                   <h1 className="truncate text-lg font-bold tracking-tight text-ink">
                                        {title}
                                   </h1>
                              </div>
                              <label className="relative hidden w-72 md:block">
                                   <span className="sr-only">{m.topbar.search}</span>
                                   <Search
                                        aria-hidden
                                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3"
                                   />
                                   <input
                                        type="search"
                                        disabled
                                        title={common.states.soon}
                                        placeholder={m.topbar.search}
                                        className="h-10 w-full cursor-not-allowed rounded-xl border border-line bg-paper pr-3 pl-9 text-sm placeholder:text-ink-3"
                                   />
                              </label>
                              <span className="hidden items-center gap-1 rounded-full bg-saffron-50 px-3 py-1.5 text-xs font-semibold text-ink sm:inline-flex">
                                   <Sparkles aria-hidden className="size-3.5 text-saffron-600" />
                                   {interpolate(m.plan.trial, { plan: plan.name })}
                              </span>
                              <button
                                   type="button"
                                   disabled
                                   aria-label={m.topbar.notifications}
                                   title={common.states.soon}
                                   className="flex size-10 items-center justify-center rounded-xl border border-line bg-white text-ink-2 disabled:cursor-not-allowed"
                              >
                                   <Bell aria-hidden className="size-[18px]" />
                              </button>
                         </header>

                         <main id="main" className="flex-1 p-4 sm:p-6">
                              {children}
                         </main>
                    </div>
               </div>
               <AssistantWidget
                    audience="owner"
                    name={name.split(/[\s@]/)[0]}
                    links={{ contact: SUPPORT.telegram }}
               />
          </TranslationsProvider>
     )
}

function initials(name: string) {
     const parts = name
          .replace(/@.*/, '')
          .split(/[\s._-]+/)
          .filter(Boolean)
     return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'T'
}
