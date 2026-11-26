import { TranslationsProvider } from '@/i18n/provider'
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
     const { m, locale } = await getTranslations('landing')
     const common = (await getTranslations('common', locale)).m

     return (
          // Client components below (header, pricing) read the `landing` namespace
          <TranslationsProvider namespaces={['landing']}>
               <a
                    href="#main"
                    className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
               >
                    {common.skipToContent}
               </a>
               <SiteHeader />
               <main id="main">
                    <Hero m={m.hero} />
                    <SocialProof m={m.socialProof} />
                    <HowItWorks m={m.how} locale={locale} />
                    <Features m={m.features} />
                    <Chains m={m.chains} locale={locale} />
                    <Pricing />
                    <Faq m={m.faq} />
                    <FinalCta m={m.finalCta} />
               </main>
               <SiteFooter m={m.footer} />
          </TranslationsProvider>
     )
}
