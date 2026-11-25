import { getTranslations } from '@/i18n/server'

import { Hero } from './components/hero'
import { Pricing } from './components/pricing'
import {
     Chains,
     Faq,
     Features,
     FinalCta,
     HowItWorks,
     SiteFooter,
     SocialProof,
} from './components/sections'
import { SiteHeader } from './components/site-header'

/** tok-scan public landing page — guide p.21 (desktop) & p.22 (mobile). Sells to restaurant owners. */
export async function LandingPage() {
     const { m: t, locale } = await getTranslations('landing')

     return (
          <>
               <a
                    href="#main"
                    className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
               >
                    {t.common.skipToContent}
               </a>
               <SiteHeader />
               <main id="main">
                    <Hero t={t.hero} />
                    <SocialProof t={t.socialProof} />
                    <HowItWorks t={t.how} locale={locale} />
                    <Features t={t.features} />
                    <Chains t={t.chains} locale={locale} />
                    <Pricing />
                    <Faq t={t.faq} />
                    <FinalCta t={t.finalCta} />
               </main>
               <SiteFooter t={t.footer} />
          </>
     )
}
