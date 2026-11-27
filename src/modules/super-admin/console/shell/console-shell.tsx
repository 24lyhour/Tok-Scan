import { Database, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

import { TranslationsProvider } from '@/i18n/provider'
import { getTranslations } from '@/i18n/server'
import { LogoutButton } from '@/modules/tenancy'
import { initials, ShellLayout } from '@/shared/components/shell'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

import { getConsoleContext } from '../server/context'
import { ConsoleSidebar } from './console-sidebar'
import { ConsoleTopbar } from './console-topbar'

/**
 * tok-scan super-admin console frame (guide p.27): charcoal sidebar with the console badge,
 * menu and staff user card; top bar; page content. Layout of every /console page.
 */
export async function ConsoleShell({ children }: { children: ReactNode }) {
     const { user, pendingCount } = await getConsoleContext()
     const { m, locale } = await getTranslations('console')
     const common = (await getTranslations('common', locale)).m
     const name = user.name || user.email

     return (
          <TranslationsProvider namespaces={['console']}>
               <ShellLayout
                    sidebar={
                         <ConsoleSidebar
                              pendingCount={pendingCount}
                              header={
                                   <p className="flex items-center gap-2 rounded-xl border border-saffron-500/40 bg-saffron-500/10 px-3 py-2 text-xs font-semibold text-saffron-300">
                                        <ShieldCheck aria-hidden className="size-3.5 shrink-0" />
                                        <span className="truncate">{m.nav.badge}</span>
                                   </p>
                              }
                              footer={
                                   <>
                                        <a
                                             href={CONSOLE_ROUTES.dataAdmin}
                                             className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 hover:bg-white/8 hover:text-white"
                                        >
                                             <Database aria-hidden className="size-3.5" />
                                             {m.nav.dataAdmin}
                                        </a>
                                        <div className="flex items-center gap-2.5 border-t border-white/10 px-1 pt-3">
                                             <span
                                                  aria-hidden
                                                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-saffron-500 text-xs font-bold text-ink"
                                             >
                                                  {initials(name)}
                                             </span>
                                             <span className="min-w-0 flex-1 text-xs">
                                                  <span className="block truncate text-sm font-semibold text-white">
                                                       {name}
                                                  </span>
                                                  <span className="block truncate text-white/60">
                                                       {m.user.role}
                                                  </span>
                                             </span>
                                             <LogoutButton
                                                  label={common.actions.logOut}
                                                  texts={{
                                                       ...common.logout,
                                                       cancel: common.actions.cancel,
                                                  }}
                                                  loginHref={CONSOLE_ROUTES.login}
                                                  className="text-white/70 hover:bg-white/10 hover:text-white"
                                             />
                                        </div>
                                   </>
                              }
                         />
                    }
                    topbar={<ConsoleTopbar />}
               >
                    {children}
               </ShellLayout>
          </TranslationsProvider>
     )
}
