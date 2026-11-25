'use client'

import { ChevronRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

import { Logo } from '@/shared/components/brand/logo'
import { LanguageToggle } from '@/shared/components/i18n/language-toggle'
import { useTranslations } from '@/i18n/client'
import { cn } from '@/shared/lib/utils'

import { links, navTargets, plans } from '../content'
import { Container, CtaLink } from './primitives'

const premium = plans.find((p) => p.id === 'premium')

export function SiteHeader() {
     const { m } = useTranslations('landing')
     const t = m.header
     const common = m.common
     const [open, setOpen] = useState(false)
     const [scrolled, setScrolled] = useState(false)
     const closeRef = useRef<HTMLButtonElement>(null)
     const openRef = useRef<HTMLButtonElement>(null)

     const nav = navTargets.map((href, i) => ({ href, label: t.nav[i] ?? href }))

     // Already on the home page (maybe at #pricing): Next.js won't navigate to the same URL,
     // so scroll back to the top ourselves and drop the #hash.
     const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
          if (window.location.pathname !== '/') return
          e.preventDefault()
          setOpen(false)
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
          if (window.location.hash) window.history.replaceState(null, '', '/')
     }

     useEffect(() => {
          const onScroll = () => setScrolled(window.scrollY > 8)
          onScroll()
          window.addEventListener('scroll', onScroll, { passive: true })
          return () => window.removeEventListener('scroll', onScroll)
     }, [])

     // Lock page scroll, move focus in, and close on Escape while the mobile menu is open
     useEffect(() => {
          if (!open) return
          const prev = document.body.style.overflow
          document.body.style.overflow = 'hidden'
          closeRef.current?.focus()
          const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
          window.addEventListener('keydown', onKey)
          const opener = openRef.current
          return () => {
               document.body.style.overflow = prev
               window.removeEventListener('keydown', onKey)
               opener?.focus({ preventScroll: true })
          }
     }, [open])

     return (
          <header
               className={cn(
                    'sticky top-0 z-40 border-b bg-paper/90 backdrop-blur-md transition-[border-color,box-shadow] duration-200',
                    scrolled
                         ? 'border-line shadow-[0_1px_12px_rgb(22_24_29/0.06)]'
                         : 'border-transparent',
               )}
          >
               <Container className="flex h-16 items-center justify-between gap-4">
                    <Link
                         href="/"
                         onClick={goHome}
                         aria-label={common.home}
                         className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-brand-300 focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
                    >
                         <Logo />
                    </Link>

                    <nav aria-label={t.mainNav} className="hidden lg:block">
                         <ul className="flex items-center gap-1">
                              {nav.map((item) => (
                                   <li key={item.href}>
                                        <a
                                             href={item.href}
                                             className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand-700"
                                        >
                                             {item.label}
                                        </a>
                                   </li>
                              ))}
                         </ul>
                    </nav>

                    <div className="hidden items-center gap-3 lg:flex">
                         <LanguageToggle />
                         <Link
                              href={links.login}
                              className="px-2 text-sm font-semibold text-ink hover:text-brand-700"
                         >
                              {t.login}
                         </Link>
                         <CtaLink href={links.signup} variant="saffron">
                              {t.startTrial}
                         </CtaLink>
                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                         <CtaLink href={links.signup} variant="saffron" size="sm">
                              {t.freeTrial}
                         </CtaLink>
                         <button
                              ref={openRef}
                              type="button"
                              onClick={() => setOpen(true)}
                              aria-expanded={open}
                              aria-controls="mobile-menu"
                              aria-label={t.openMenu}
                              className="inline-flex size-11 items-center justify-center rounded-xl text-ink hover:bg-brand-50"
                         >
                              <Menu className="size-5" />
                         </button>
                    </div>
               </Container>

               {/* Mobile menu — guide L02: nav, language, plan teaser, sticky CTA */}
               <div
                    id="mobile-menu"
                    role="dialog"
                    aria-modal="true"
                    aria-label={t.menu}
                    hidden={!open}
                    className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden"
               >
                    <div className="flex h-16 items-center justify-between border-b border-line px-4">
                         <Logo size="sm" />
                         <button
                              ref={closeRef}
                              type="button"
                              onClick={() => setOpen(false)}
                              aria-label={t.closeMenu}
                              className="inline-flex size-11 items-center justify-center rounded-xl text-ink hover:bg-brand-50"
                         >
                              <X className="size-5" />
                         </button>
                    </div>

                    <nav aria-label={t.menu} className="flex-1 overflow-y-auto px-4">
                         <ul className="divide-y divide-line">
                              {nav.map((item) => (
                                   <li key={item.href}>
                                        <a
                                             href={item.href}
                                             onClick={() => setOpen(false)}
                                             className="flex items-center justify-between py-4 text-lg font-semibold text-ink"
                                        >
                                             {item.label}
                                             <ChevronRight
                                                  aria-hidden
                                                  className="size-5 text-ink-3"
                                             />
                                        </a>
                                   </li>
                              ))}
                         </ul>

                         <div className="mt-4 flex items-center justify-between">
                              <span className="text-sm text-ink-2">{common.language}</span>
                              <LanguageToggle />
                         </div>

                         {premium && (
                              <a
                                   href="#pricing"
                                   onClick={() => setOpen(false)}
                                   className="mt-6 block rounded-[14px] border border-brand-100 bg-brand-50 p-4"
                              >
                                   <span className="font-semibold text-ink">
                                        ✦ {premium.name} · ${premium.monthly} {t.perMonth}
                                   </span>
                                   <span className="mt-1 block text-sm text-ink-2">
                                        {t.premiumTeaser}
                                   </span>
                              </a>
                         )}
                    </nav>

                    <div className="space-y-3 border-t border-line px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                         <CtaLink
                              href={links.signup}
                              variant="saffron"
                              size="lg"
                              className="w-full"
                         >
                              {t.startTrial}
                         </CtaLink>
                         <CtaLink href={links.login} variant="outline" size="lg" className="w-full">
                              {t.login}
                         </CtaLink>
                         <p className="text-center text-xs text-ink-3">
                              {t.questions}{' '}
                              <a
                                   href={links.telegram}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="font-medium text-brand-700 underline-offset-2 hover:underline"
                              >
                                   {links.telegramHandle}
                              </a>
                         </p>
                    </div>
               </div>
          </header>
     )
}
