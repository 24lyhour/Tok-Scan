import { Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

import { TranslationsProvider } from '@/i18n/provider'
import { getTranslations } from '@/i18n/server'
import { AssistantWidget } from '@/modules/agents'
import { authRoutes, LogoutButton } from '@/modules/tenancy'
import { initials, ShellLayout } from '@/shared/components/shell'
import { SUPPORT } from '@/shared/config/contact'
import { formatDate, interpolate, localizeDigits } from '@/shared/i18n/format'

import { getWorkspaceContext } from '../server/context'
import { Sidebar } from './sidebar'
import { Switcher } from './switcher'
import { Topbar } from './topbar'

/**
 * The signed-in app frame (guide p.8 / p.24): dark sidebar with the switcher, menu, plan and
 * user; a top bar with section · date, page title, search, plan badge and notifications.
 * It is the layout of every app page (src/app/(frontend)/(app)/layout.tsx): pages only render
 * their content; the title comes from the menu (nav.ts).
 */
export async function AppShell({ children }: { children: ReactNode }) {
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
                              {m.plan.trial}
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
               <ShellLayout
                    sidebar={
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
                    }
                    topbar={
                         <Topbar
                              today={interpolate(m.topbar.today, {
                                   date: formatDate(new Date(), locale),
                              })}
                              planBadge={m.plan.trial}
                         />
                    }
               >
                    {children}
               </ShellLayout>
               <AssistantWidget
                    audience="owner"
                    name={name.split(/[\s@]/)[0]}
                    links={{ contact: SUPPORT.telegram }}
               />
          </TranslationsProvider>
     )
}
