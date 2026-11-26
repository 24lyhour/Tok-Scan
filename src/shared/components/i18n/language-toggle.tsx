'use client'

import { Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { useTranslations } from '@/i18n/client'
import { LOCALE_COOKIE, locales, type Locale } from '@/shared/i18n/locales'
import { cn } from '@/shared/lib/utils'

/** Remember the reader's language for a year (read on the server by getLocale). */
function saveLocale(locale: Locale) {
     document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
}

/** EN / ខ្មែរ / 中文 switch — saves the choice in a cookie and re-renders the page on the server. */
export function LanguageToggle({ className }: { className?: string }) {
     const { locale, t } = useTranslations('common')
     const router = useRouter()
     const [pending, startTransition] = useTransition()

     const choose = (next: Locale) => {
          if (next === locale) return
          saveLocale(next)
          startTransition(() => router.refresh())
     }

     return (
          <div
               role="group"
               aria-label={t('language')}
               aria-busy={pending}
               className={cn(
                    'inline-flex items-center rounded-full border border-line bg-white p-0.5 text-xs font-semibold',
                    pending && 'opacity-70',
                    className,
               )}
          >
               <Globe aria-hidden className="mx-1.5 size-3.5 text-ink-3" />
               {locales.map(({ code: l, short, nativeLabel }) => {
                    const active = l === locale
                    return (
                         <button
                              key={l}
                              type="button"
                              lang={l}
                              title={nativeLabel}
                              aria-pressed={active}
                              onClick={() => choose(l)}
                              className={cn(
                                   'min-h-7 rounded-full px-2.5 transition-colors duration-[120ms]',
                                   l === 'km' && 'font-khmer',
                                   l === 'zh' && 'font-zh',
                                   active
                                        ? 'bg-brand-50 text-brand-700'
                                        : 'text-ink-3 hover:text-ink',
                              )}
                         >
                              {short}
                         </button>
                    )
               })}
          </div>
     )
}
