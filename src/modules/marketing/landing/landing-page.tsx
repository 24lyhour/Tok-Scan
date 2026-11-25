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
export function LandingPage() {
     return (
          <>
               <a
                    href="#main"
                    className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
               >
                    Skip to content
               </a>
               <SiteHeader />
               <main id="main">
                    <Hero />
                    <SocialProof />
                    <HowItWorks />
                    <Features />
                    <Chains />
                    <Pricing />
                    <Faq />
                    <FinalCta />
               </main>
               <SiteFooter />
          </>
     )
}
