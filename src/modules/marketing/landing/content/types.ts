/**
 * Shape of the landing page copy. Items are keyed by the ids in data.ts, so reordering or adding
 * an item can't attach the wrong icon or link.
 */
import type { PluralForms } from '@/shared/i18n/format'

import type { featureIds, footerColumns, navItems, PlanId, sampleOutlets, stepIds } from './data'

type StepId = (typeof stepIds)[number]
type FeatureId = (typeof featureIds)[number]
type NavId = (typeof navItems)[number]['id']
type OutletId = (typeof sampleOutlets)[number]['id']
type FooterColumnId = (typeof footerColumns)[number]['id']
type FooterLinkId = (typeof footerColumns)[number]['links'][number]['id']
type TitleBody = { title: string; body: string }
type PlanCopy = { limits: string; features: string[]; cta: string; badge: string }

/** Shape every language must provide. */
export type LandingContent = {
     meta: { title: string; description: string }
     header: {
          nav: Record<NavId, string>
          login: string
          startTrial: string
          freeTrial: string
          openMenu: string
          closeMenu: string
          menu: string
          mainNav: string
          premiumTeaser: string
          perMonth: string
          questions: string
     }
     hero: {
          eyebrow: string
          titleLine1: string
          titleLine2: string
          body: string
          bodyShort: string
          primaryCta: string
          secondaryCta: string
          checks: string[]
          paymentsLabel: string
          payments: string[]
          visualLabel: string
          /** Text inside the phone / kitchen-ticket illustration */
          visual: {
               signature: string
               dish: string
               dishDescription: string
               add: string
               paid: string
               ticketItem: string
               ticketNote: string
               markReady: string
          }
     }
     socialProof: { label: string; region: string }
     how: { eyebrow: string; title: string; body: string; steps: Record<StepId, TitleBody> }
     features: {
          eyebrow: string
          title: string
          compare: string
          items: Record<FeatureId, TitleBody>
     }
     chains: {
          eyebrow: string
          title: string
          body: string
          points: string[]
          diagramLabel: string
          platform: string
          platformSub: string
          organization: string
          organizationSub: string
          tables: PluralForms
          staff: PluralForms
          areas: Record<OutletId, string>
          note: string
     }
     pricing: {
          eyebrow: string
          title: string
          body: string
          billingPeriod: string
          monthly: string
          yearly: string
          yearlyNote: string
          perMonth: string
          /** `{amount}` = formatted yearly total */
          billedYearly: string
          billedMonthly: string
          volume: string
          custom: string
          note: string
          plans: Record<PlanId, PlanCopy>
     }
     faq: { eyebrow: string; title: string; curious: string; items: { q: string; a: string }[] }
     finalCta: { title: string; body: string; primary: string; secondary: string }
     footer: {
          blurb: string
          payments: string
          columns: Record<FooterColumnId, string>
          links: Record<FooterLinkId, string>
          /** `{year}` = current year */
          rights: string
          tagline: string
     }
}
