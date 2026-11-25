import Link from 'next/link'
import type { ReactNode } from 'react'

import { Logo } from '@/shared/components/brand/logo'
import { LanguageToggle } from '@/shared/components/i18n/language-toggle'
import { cn } from '@/shared/lib/utils'

/**
 * Page frame for sign-in and onboarding screens: logo + language switch on top, one white card.
 * - `meta` / `progress`: optional slot under the header (onboarding uses "Step n of 4" + bar).
 * - `aside`: optional brand panel, shown beside the card on large screens only.
 */
export function AuthShell({
     homeLabel,
     meta,
     progress,
     aside,
     children,
}: {
     homeLabel: string
     meta?: ReactNode
     progress?: ReactNode
     aside?: ReactNode
     children: ReactNode
}) {
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
                         <Link
                              href="/"
                              aria-label={homeLabel}
                              className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-brand-300"
                         >
                              <Logo size="sm" />
                         </Link>
                         <div className="flex items-center gap-3">
                              {meta}
                              <LanguageToggle />
                         </div>
                    </header>

                    {progress}

                    <main className="mt-6 flex flex-1 flex-col rounded-3xl border border-line bg-white p-5 shadow-[0_12px_40px_-20px_rgb(22_24_29/0.18)] sm:mt-8 sm:p-8">
                         {children}
                    </main>
               </div>
          </div>
     )
}
