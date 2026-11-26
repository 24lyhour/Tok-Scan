'use client'

import { Cookie } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useTranslations } from '@/i18n/client'

import type { Consent } from '../consent'
import { saveConsent, useConsent } from '../use-consent'

/**
 * Cookie consent banner. Bottom-left card on desktop, full width on phones. Both choices are
 * equally easy (no dark patterns); the choice lasts six months.
 */
export function CookieBanner({ initial }: { initial: Consent | null }) {
     const { m } = useTranslations('consent')
     const consent = useConsent(initial)
     // Publish the banner's height so the chat button can sit above it on phones
     const [el, setEl] = useState<HTMLElement | null>(null)
     useEffect(() => {
          if (!el) return
          const root = document.documentElement
          const observer = new ResizeObserver(() =>
               root.style.setProperty('--consent-offset', `${el.offsetHeight + 12}px`),
          )
          observer.observe(el)
          return () => {
               observer.disconnect()
               root.style.removeProperty('--consent-offset')
          }
     }, [el])
     if (consent) return null

     return (
          <section
               ref={setEl}
               role="region"
               aria-label={m.label}
               className="fixed inset-x-3 bottom-3 z-[45] rounded-2xl border border-line bg-white p-4 shadow-popover motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-sm sm:p-5"
          >
               <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-saffron-50 text-saffron-600">
                         <Cookie aria-hidden className="size-5" />
                    </span>
                    <div className="min-w-0">
                         <h2 className="text-sm font-semibold text-ink">{m.title}</h2>
                         <p className="mt-1 text-xs leading-relaxed text-ink-2">
                              {m.body}{' '}
                              <Link
                                   href="/privacy"
                                   className="font-medium text-brand-700 underline-offset-2 hover:underline"
                              >
                                   {m.policy}
                              </Link>
                         </p>
                    </div>
               </div>
               <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                         type="button"
                         onClick={() => saveConsent('essential')}
                         className="h-10 rounded-xl border border-line bg-white text-sm font-semibold text-ink hover:bg-paper focus-visible:ring-3 focus-visible:ring-brand-300 focus-visible:outline-none"
                    >
                         {m.essential}
                    </button>
                    <button
                         type="button"
                         onClick={() => saveConsent('all')}
                         className="h-10 rounded-xl bg-brand-700 text-sm font-semibold text-white hover:bg-brand-800 focus-visible:ring-3 focus-visible:ring-brand-300 focus-visible:outline-none"
                    >
                         {m.accept}
                    </button>
               </div>
          </section>
     )
}
