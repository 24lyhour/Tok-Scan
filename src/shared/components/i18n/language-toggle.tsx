'use client'

import { Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { useTranslations } from '@/i18n/client'
import {
     SITE_LOCALE_COOKIE,
     siteLocaleLabels,
     siteLocales,
     type SiteLocale,
} from '@/shared/i18n/site-locale'
import { cn } from '@/shared/lib/utils'

/** EN / ខ្មែរ / 中文 switch — saves the choice in a cookie and re-renders the page on the server. */
export function LanguageToggle({ className }: { className?: string }) {
     const { locale, t } = useTranslations('common')
     const router = useRouter()
     const [pending, startTransition] = useTransition()

     const choose = (next: SiteLocale) => {
          if (next === locale) return
          document.cookie = `${SITE_LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
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
               {siteLocales.map((l) => {
                    const active = l === locale
                    return (
                         <button
                              key={l}
                              type="button"
                              lang={l}
                              title={t(`languages.${l}`)}
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
                              {siteLocaleLabels[l]}
                         </button>
                    )
               })}
          </div>
     )
}
