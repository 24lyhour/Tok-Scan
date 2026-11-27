import Link from 'next/link'
import type { ReactNode } from 'react'

import { Logo } from '@/shared/components/brand/logo'
import { LanguageToggle } from '@/shared/components/i18n/language-toggle'
import { cn } from '@/shared/lib/utils'

/**
 * Page frame for sign-in and onboarding screens: logo + language switch on top, one white card.
 * - `meta` / `progress`: optional slot under the header (onboarding uses "Step n of 4" + bar).
 * - `aside`: optional brand panel, shown beside the card on large screens only.
 * - `variant="staff"` (tok-scan staff login, guide p.27): narrower charcoal panel, light grid
 *   background, the card centred with the logo inside it.
 */
export function AuthShell({
     homeLabel,
     meta,
     progress,
     aside,
     variant = 'owner',
     children,
}: {
     homeLabel: string
     meta?: ReactNode
     progress?: ReactNode
     aside?: ReactNode
     variant?: 'owner' | 'staff'
     children: ReactNode
}) {
     const home = (
          <Link
               href="/"
               aria-label={homeLabel}
               className="w-fit rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-brand-300"
          >
               <Logo size="sm" />
          </Link>
     )

     if (variant === 'staff') {
          return (
               <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[46vw_1fr]">
                    {aside && (
                         <aside className="relative hidden overflow-hidden lg:block">{aside}</aside>
                    )}
                    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-16 [background-image:linear-gradient(color-mix(in_oklab,var(--color-line)_55%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--color-line)_55%,transparent)_1px,transparent_1px)] [background-size:32px_32px]">
                         <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                              <LanguageToggle />
                         </div>
                         <main className="flex w-full max-w-[30rem] flex-col rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8">
                              <div className="mb-6">{home}</div>
                              {children}
                         </main>
                    </div>
               </div>
          )
     }

     return (
          <div
               className={cn(
                    'min-h-dvh bg-paper',
                    aside && 'lg:grid lg:grid-cols-[1fr_minmax(0,40rem)]',
               )}
          >
               {aside && (
                    <aside className="relative hidden overflow-hidden bg-brand-900 text-white lg:flex lg:flex-col">
                         {aside}
                    </aside>
               )}
               <div className="mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col px-4 py-5 sm:py-10">
                    <header className="flex items-center justify-between gap-3">
                         {home}
                         <div className="flex items-center gap-3">
                              {meta}
                              <LanguageToggle />
                         </div>
                    </header>

                    {progress}

                    {/* Phones: the card fills the screen so the main button sits in the thumb zone.
                        Larger screens: the card is as tall as its content (no empty gap). */}
                    <main className="mt-6 flex flex-1 flex-col rounded-3xl border border-line bg-white p-5 shadow-card sm:mt-8 sm:flex-none sm:p-8">
                         {children}
                    </main>
               </div>
          </div>
     )
}
