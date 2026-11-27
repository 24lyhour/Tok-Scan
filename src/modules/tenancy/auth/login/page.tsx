import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { LoginPanel } from '@/shared/components/super-admin/login-panel'
import { TranslationsProvider } from '@/i18n/provider'
import { getTranslations } from '@/i18n/server'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

import { AuthShell } from '../../shared/auth-shell'
import { googleStartHref, isGoogleEnabled, isGoogleErrorCode } from '../google/config'
import { authRoutes, isStaffLogin, safeNextPath } from '../routes'
import { getCurrentUser } from '../server/current-user'
import { LoginAside } from './aside'
import { LoginForm } from './form'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

/** tok-scan login — same card style as sign-up, with a brand panel on desktop. */
export async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
     const params = await searchParams
     const nextParam = typeof params.next === 'string' ? params.next : undefined
     const next = nextParam ? safeNextPath(nextParam, authRoutes.afterLogin) : undefined

     // Staff login (console) and owner login are separate: only the matching account skips it
     const staff = isStaffLogin(next)
     const current = await getCurrentUser()
     if (staff && current.staff) redirect(next ?? CONSOLE_ROUTES.home)
     if (!staff && current.user) redirect(next ?? authRoutes.afterLogin)

     const { m } = await getTranslations('auth')
     const common = (await getTranslations('common')).m
     const email = typeof params.email === 'string' ? params.email.slice(0, 254) : ''
     const oauthError = isGoogleErrorCode(params.error) ? params.error : undefined
     const googleHref = isGoogleEnabled() ? googleStartHref(authRoutes.login, next) : null

     return (
          <TranslationsProvider namespaces={['auth']}>
               <AuthShell
                    homeLabel={common.home}
                    variant={staff ? 'staff' : 'owner'}
                    aside={
                         staff ? (
                              <LoginPanel
                                   title={m.login.staffAside.title}
                                   points={m.login.staffAside.points}
                                   pendingLabel={m.login.staffAside.pending}
                                   approveLabel={m.login.staffAside.approve}
                                   statusLabels={m.login.staffAside.status}
                              />
                         ) : (
                              <LoginAside m={m.aside} />
                         )
                    }
               >
                    {staff && (
                         <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-saffron-500/45 bg-saffron-500/15 px-2.5 py-1 text-xs font-semibold text-ink">
                              <ShieldCheck aria-hidden className="size-3.5" />
                              {m.login.staffBadge}
                         </span>
                    )}
                    <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">
                         {staff ? m.login.staffTitle : m.login.title}
                    </h1>
                    <p className="mt-1 mb-6 text-sm text-ink-3">
                         {staff ? m.login.staffSubtitle : m.login.subtitle}
                    </p>
                    <LoginForm
                         next={next}
                         defaultEmail={email}
                         signupHref={authRoutes.signup}
                         forgotHref={
                              staff
                                   ? `${authRoutes.forgotPassword}?staff=1`
                                   : authRoutes.forgotPassword
                         }
                         googleHref={googleHref}
                         oauthError={oauthError}
                         staff={staff}
                    />
                    {staff && (
                         <p className="mt-4 text-center text-sm text-ink-2">
                              {m.login.ownerQuestion}{' '}
                              <Link
                                   href={authRoutes.login}
                                   className="font-semibold text-brand-700 hover:underline"
                              >
                                   {m.login.ownerLink}
                              </Link>
                         </p>
                    )}
               </AuthShell>
          </TranslationsProvider>
     )
}

export async function loginMetadata() {
     const { t } = await getTranslations('auth')
     return { title: t('login.metaTitle') }
}
