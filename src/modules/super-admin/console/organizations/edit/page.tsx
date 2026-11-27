import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TranslationsProvider } from '@/i18n/provider'
import { getTranslations } from '@/i18n/server'
import { getPublicOrigin } from '@/modules/tenancy'
import type { User } from '@/payload-types'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

import { getConsoleContext } from '../../server/context'
import { OrgEditForm } from './form'

type Params = Promise<{ id: string }>

export async function orgEditMetadata(): Promise<Metadata> {
     const { m } = await getTranslations('console')
     return { title: m.edit.title, robots: { index: false } }
}

/** /console/organizations/<id>/edit — fix a restaurant's details for the owner (support). */
export async function OrgEditPage({ params }: { params: Params }) {
     const { payload } = await getConsoleContext()
     const id = Number((await params).id)
     const org =
          Number.isInteger(id) && id > 0
               ? await payload
                      .findByID({ collection: 'organizations', id, depth: 1, overrideAccess: true })
                      .catch(() => null)
               : null
     if (!org) notFound()

     const owner = typeof org.owner === 'object' ? (org.owner as User) : null
     const { m } = await getTranslations('console')
     const host = new URL(await getPublicOrigin()).host
     const back = `${CONSOLE_ROUTES.organizations}?org=${org.id}`

     return (
          <TranslationsProvider namespaces={['onboarding']}>
               <div className="mx-auto max-w-2xl space-y-4">
                    <Link
                         href={back}
                         className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
                    >
                         <ArrowLeft aria-hidden className="size-4" />
                         {m.edit.back}
                    </Link>
                    <div>
                         <h1 className="text-xl font-bold tracking-tight text-ink">
                              {m.edit.title}
                         </h1>
                         <p className="mt-0.5 text-sm text-ink-3">{org.name}</p>
                    </div>
                    <OrgEditForm
                         menuBase={`${host}/r/`}
                         cancelHref={back}
                         initial={{
                              id: org.id,
                              name: org.name,
                              slug: org.slug,
                              businessType: org.businessType ?? 'restaurant',
                              businessTypeOther: org.businessTypeOther ?? '',
                              trialEndsAt: org.trialEndsAt?.slice(0, 10) ?? '',
                              ownerName: owner?.name ?? '',
                              ownerEmail: owner?.email ?? '',
                         }}
                    />
               </div>
          </TranslationsProvider>
     )
}
