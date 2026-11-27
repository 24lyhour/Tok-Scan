import { redirect } from 'next/navigation'

import { TranslationsProvider } from '@/i18n/provider'
import { getTranslations } from '@/i18n/server'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

import { AuthShell } from '../../shared/auth-shell'
import { googleStartHref, isGoogleEnabled, isGoogleErrorCode } from '../google/config'
import { authRoutes, safeNextPath } from '../routes'
import { getCurrentUser } from '../server/current-user'
import { LoginAside } from './aside'
import { LoginForm } from './form'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

/** tok-scan login — same card style as sign-up, with a brand panel on desktop. */
export async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
     const params = await searchParams
     const nextParam = typeof params.next === 'string' ? params.next : undefined
     const next = nextParam ? safeNextPath(nextParam, authRoutes.afterLogin) : undefined

     const { user } = await getCurrentUser()
     if (user) redirect(next ?? authRoutes.afterLogin)

     const { m } = await getTranslations('auth')
     const common = (await getTranslations('common')).m
     const email = typeof params.email === 'string' ? params.email.slice(0, 254) : ''
     const oauthError = isGoogleErrorCode(params.error) ? params.error : undefined
     const googleHref = isGoogleEnabled() ? googleStartHref(authRoutes.login, next) : null
     // Going to the super-admin console → staff login: email + password only (no Google)
     const staff =
          next === CONSOLE_ROUTES.home || Boolean(next?.startsWith(`${CONSOLE_ROUTES.home}/`))

     return (
          <TranslationsProvider namespaces={['auth']}>
               <AuthShell homeLabel={common.home} aside={<LoginAside m={m.aside} />}>
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
                         forgotHref={authRoutes.forgotPassword}
                         googleHref={googleHref}
                         oauthError={oauthError}
                         staff={staff}
                    />
               </AuthShell>
          </TranslationsProvider>
     )
}

export async function loginMetadata() {
     const { t } = await getTranslations('auth')
     return { title: t('login.metaTitle') }
}
