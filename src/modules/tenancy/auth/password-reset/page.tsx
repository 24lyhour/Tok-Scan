import { MailCheck } from 'lucide-react'
import Link from 'next/link'

import { TranslationsProvider } from '@/i18n/provider'
import { getTranslations } from '@/i18n/server'

import { AuthShell } from '../../shared/auth-shell'
import { LoginAside } from '../login/aside'
import { authRoutes } from '../routes'
import { ForgotForm } from './forgot-form'
import { ResetForm } from './reset-form'

type SearchParams = Promise<Record<string, string | string[] | undefined>>
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

/** Same frame as the login page: brand panel on desktop, one card. */
async function Frame({
     title,
     subtitle,
     children,
}: {
     title: string
     subtitle: string
     children: React.ReactNode
}) {
     const { m } = await getTranslations('auth')
     const common = (await getTranslations('common')).m
     return (
          <TranslationsProvider namespaces={['auth']}>
               <AuthShell homeLabel={common.home} aside={<LoginAside m={m.aside} />}>
                    <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">
                         {title}
                    </h1>
                    <p className="mt-1 mb-6 text-sm text-ink-3">{subtitle}</p>
                    {children}
               </AuthShell>
          </TranslationsProvider>
     )
}

/** /forgot-password — enter your email; after sending: "Check your email". */
export async function ForgotPasswordPage({ searchParams }: { searchParams: SearchParams }) {
     const params = await searchParams
     const { m } = await getTranslations('auth')
     const copy = m.forgot

     if (first(params.sent)) {
          return (
               <Frame title={copy.sentTitle} subtitle={copy.sentBody}>
                    <div className="flex flex-1 flex-col">
                         <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                              <MailCheck aria-hidden className="size-6" />
                         </span>
                         <p className="mt-4 text-sm text-ink-2">{copy.spam}</p>
                         <div className="mt-auto space-y-3 pt-8 text-center text-sm">
                              <Link
                                   href={authRoutes.login}
                                   className="flex h-12 items-center justify-center rounded-xl bg-brand-700 font-semibold text-white hover:bg-brand-800"
                              >
                                   {copy.back}
                              </Link>
                              <Link
                                   href={authRoutes.forgotPassword}
                                   className="block font-semibold text-brand-700 hover:underline"
                              >
                                   {copy.again}
                              </Link>
                         </div>
                    </div>
               </Frame>
          )
     }

     const email = first(params.email)?.slice(0, 254) ?? ''
     return (
          <Frame title={copy.title} subtitle={copy.subtitle}>
               <ForgotForm loginHref={authRoutes.login} defaultEmail={email} />
          </Frame>
     )
}

/** /reset-password?token=… — the page the email button opens. */
export async function ResetPasswordPage({ searchParams }: { searchParams: SearchParams }) {
     const params = await searchParams
     const { m } = await getTranslations('auth')
     const copy = m.reset
     const token = first(params.token)?.trim() ?? ''

     if (!token) {
          return (
               <Frame title={copy.invalidTitle} subtitle={copy.invalidBody}>
                    <div className="mt-auto pt-8">
                         <Link
                              href={authRoutes.forgotPassword}
                              className="flex h-12 items-center justify-center rounded-xl bg-brand-700 text-sm font-semibold text-white hover:bg-brand-800"
                         >
                              {copy.requestNew}
                         </Link>
                    </div>
               </Frame>
          )
     }

     return (
          <Frame title={copy.title} subtitle={copy.subtitle}>
               <ResetForm token={token} forgotHref={authRoutes.forgotPassword} />
          </Frame>
     )
}

export async function forgotPasswordMetadata() {
     const { m } = await getTranslations('auth')
     return { title: m.forgot.metaTitle, robots: { index: false } }
}

export async function resetPasswordMetadata() {
     const { m } = await getTranslations('auth')
     return { title: m.reset.metaTitle, robots: { index: false } }
}
