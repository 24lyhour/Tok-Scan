import type { Metadata, Viewport } from 'next'
import { Inter, Kantumruy_Pro } from 'next/font/google'
import React from 'react'

import { TranslationsProvider } from '@/i18n/provider'
import { getTranslations } from '@/i18n/server'
import { COLORS } from '@/shared/config/colors'
import { getLocaleConfig } from '@/shared/i18n/locales'

import './styles.css'

// Inter (with optical sizing so large headings render like Inter Display) + Khmer fallback — guide p.03
const inter = Inter({
     subsets: ['latin'],
     axes: ['opsz'],
     variable: '--font-inter',
     display: 'swap',
})

const khmer = Kantumruy_Pro({
     subsets: ['khmer'],
     variable: '--font-kantumruy',
     display: 'swap',
})

// Site-wide defaults in the visitor's language; pages override `title` / `description`.
export async function generateMetadata(): Promise<Metadata> {
     const { m } = await getTranslations('common')
     return {
          ...staticMetadata,
          title: { default: m.meta.title, template: m.meta.titleTemplate },
          description: m.meta.description,
     }
}

const staticMetadata: Metadata = {
     applicationName: 'tok-scan',
     // tok-scan logo tile — files in /public (generated from public/favicon.svg)
     icons: {
          icon: [
               { url: '/favicon.ico', sizes: '48x48' },
               { url: '/favicon.svg', type: 'image/svg+xml' },
          ],
          apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
     },
     manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
     themeColor: COLORS['brand-900'],
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
     const { locale } = await getTranslations('common')
     return (
          <html
               lang={getLocaleConfig(locale).htmlLang}
               className={`${inter.variable} ${khmer.variable}`}
          >
               <head>
                    {/* Scroll-reveal content must stay visible when JavaScript is off */}
                    <noscript
                         dangerouslySetInnerHTML={{
                              __html: '<style>[data-reveal]{opacity:1!important;transform:none!important}</style>',
                         }}
                    />
               </head>
               {/* Browser extensions (e.g. WOT) inject attributes on <body> before React hydrates */}
               <body suppressHydrationWarning>
                    {/* Only `common` here — each page adds its own namespaces */}
                    <TranslationsProvider namespaces={['common']}>{children}</TranslationsProvider>
               </body>
          </html>
     )
}
