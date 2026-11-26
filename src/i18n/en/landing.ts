/**
 * Shape of the landing page copy. Items are keyed by the ids in data.ts, so reordering or adding
 * an item can't attach the wrong icon or link.
 */
import type { PluralForms } from '@/shared/i18n/format'

import type {
     featureIds,
     footerColumns,
     navItems,
     PlanId,
     sampleOutlets,
     stepIds,
} from '@/modules/marketing'

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

/** English landing copy. */

export const landing: LandingContent = {
     meta: {
          title: 'tok·scan — QR ordering & billing for Cambodian restaurants',
          description:
               'Guests order from their phone, the kitchen sees it instantly, and bills are paid by KHQR. One restaurant or twenty outlets.',
     },
     header: {
          nav: {
               features: 'Features',
               how: 'How it works',
               pricing: 'Pricing',
               chains: 'For chains',
               faq: 'FAQ',
          },
          login: 'Log in',
          startTrial: 'Start free trial',
          freeTrial: 'Free trial',
          openMenu: 'Open menu',
          closeMenu: 'Close menu',
          menu: 'Menu',
          mainNav: 'Main',
          premiumTeaser: '5 outlets · custom domain · advanced analytics',
          perMonth: '/ month',
          questions: 'Questions? Telegram',
     },
     hero: {
          eyebrow: 'QR ordering & billing for Cambodian restaurants',
          titleLine1: 'Scan. Order. Pay.',
          titleLine2: 'Every table.',
          body: 'Guests order from their phone, the kitchen sees it instantly, and bills are paid by KHQR before they ask for the check — across one restaurant or twenty outlets.',
          bodyShort:
               'Guests order from their phone and pay by KHQR — no app, no waiting for the check.',
          primaryCta: 'Start 14-day free trial',
          secondaryCta: 'Book a demo',
          checks: ['No card needed', 'Set up in 15 minutes', 'Khmer & English'],
          paymentsLabel: 'Supported payments',
          payments: ['KHQR', 'ABA PayWay', 'Visa · Mastercard', 'Cash'],
          visualLabel:
               "tok-scan on a guest's phone: a Fish Amok menu card, a KHQR bill marked Paid, and the kitchen ticket for table 7",
          visual: {
               signature: 'Signature',
               dish: 'Fish Amok',
               dishDescription: 'Steamed fish in coconut-kroeung curry, banana leaf.',
               add: 'Add',
               paid: 'Paid',
               ticketItem: '2× Fish Amok',
               ticketNote: 'No chilli · extra rice',
               markReady: 'Mark ready',
          },
     },
     socialProof: {
          label: 'Restaurants already serving with tok·scan',
          region: 'Customers',
     },
     how: {
          eyebrow: 'How it works',
          title: 'From table to paid in three taps',
          body: 'No app for guests, no new hardware for you. If you have phones and a tablet, you can start tonight.',
          steps: {
               scan: {
                    title: 'Guests scan',
                    body: 'Every table has its own QR code. The menu opens in the browser — nothing to install, table already known.',
               },
               cook: {
                    title: 'Kitchen cooks',
                    body: 'Orders land on the kitchen display in seconds, with notes and allergies in amber. No more lost paper tickets.',
               },
               pay: {
                    title: 'Pay by KHQR',
                    body: 'All orders roll into one bill. Guests pay with KHQR, ABA, card or cash — marked paid only after the bank confirms.',
               },
          },
     },
     features: {
          eyebrow: 'Features',
          title: 'Everything a busy floor needs',
          compare: 'Compare plans',
          items: {
               menu: {
                    title: 'QR menu & ordering',
                    body: 'Photos, options, add-ons, sold-out states and a cart that sits in the thumb zone.',
               },
               kitchen: {
                    title: 'Kitchen display',
                    body: 'Live tickets by station, overdue alerts, and a sound on every new order.',
               },
               split: {
                    title: 'Cashier & split bills',
                    body: 'Split equally, by item or custom. Change is shown in USD and riel.',
               },
               khqr: {
                    title: 'KHQR & ABA PayWay',
                    body: 'Dynamic QR per bill, auto-verified. Duplicate payments are blocked.',
               },
               outlets: {
                    title: 'Multi-outlet',
                    body: 'One menu for the whole group, with prices and stock per branch.',
               },
               reports: {
                    title: 'Sales reports',
                    body: 'Revenue, best sellers, peak hours and payment mix — export to CSV or PDF.',
               },
          },
     },
     chains: {
          eyebrow: 'For chains',
          title: 'One menu. Every branch. One login.',
          body: 'Run every outlet from one organization: shared menu with per-branch prices and stock, a role per outlet for each staff member, and reports across the whole group.',
          points: [
               'Switch between outlets from the sidebar',
               'Manager at one branch, cashier at another — one account',
               'Each branch can use its own KHQR merchant ID',
               'Custom domain on Premium & Chain',
          ],
          diagramLabel: 'Example organization with three outlets',
          platform: 'tok·scan platform',
          platformSub: 'Plans · approvals · payment partners',
          organization: 'Organization — “Mahob Group”',
          organizationSub: 'Owner & members · shared menu · logo & colours',
          tables: { one: '{count} table', other: '{count} tables' },
          staff: { one: '{count} staff', other: '{count} staff' },
          areas: {
               bkk1: 'Street 240, Phnom Penh',
               riverside: 'Sisowath Quay',
               aeon: 'Sen Sok, food court',
          },
          note: 'A single restaurant is simply an organization with one outlet — no migration when you open a second branch.',
     },
     pricing: {
          eyebrow: 'Pricing',
          title: 'Simple plans per organization',
          body: 'Every plan starts with a 14-day free trial. Add outlets as you grow.',
          billingPeriod: 'Billing period',
          monthly: 'Monthly',
          yearly: 'Yearly',
          yearlyNote: '2 months free',
          perMonth: '/ month',
          billedYearly: '{amount} billed yearly',
          billedMonthly: 'Billed monthly',
          volume: 'Volume pricing',
          custom: 'Custom',
          note: 'Prices in USD. Guest payments (KHQR, ABA, card, cash) go straight to your own merchant account — tok·scan only bills the subscription.',
          plans: {
               starter: {
                    limits: '{outlets} outlet · {tables} tables · {staff} staff',
                    features: ['QR menu & ordering', 'Kitchen & cashier', 'KHQR & cash'],
                    cta: 'Start free trial',
                    badge: '',
               },
               growth: {
                    limits: '{outlets} outlets · {tables} tables · {staff} staff',
                    features: [
                         'Everything in Starter',
                         'Split & partial bills',
                         'Reports & exports',
                    ],
                    cta: 'Start free trial',
                    badge: 'Most popular',
               },
               premium: {
                    limits: '{outlets} outlets · {tables} tables · {staff} staff',
                    features: [
                         'Everything in Growth',
                         'Custom domain · no tok·scan footer',
                         'Advanced analytics & loyalty',
                         'Priority support',
                    ],
                    cta: 'Start free trial',
                    badge: '✦ Premium',
               },
               chain: {
                    limits: 'Unlimited outlets · API',
                    features: [
                         'Everything in Premium',
                         'API & accounting integrations',
                         'Dedicated manager & SLA',
                    ],
                    cta: 'Talk to sales',
                    badge: '',
               },
          },
     },
     faq: {
          eyebrow: 'FAQ',
          title: 'Questions owners ask',
          curious: 'Still curious? Message us on',
          items: [
               {
                    q: 'Do guests need to download an app?',
                    a: 'No. Guests scan the QR code on the table and the menu opens in their phone’s browser. It works on any smartphone, in Khmer or English.',
               },
               {
                    q: 'When does the money from guest payments reach me?',
                    a: 'Guest payments by KHQR, ABA or card go straight to your own merchant account — tok·scan never holds your money. We only bill your monthly subscription.',
               },
               {
                    q: 'Can I run several branches with one menu?',
                    a: 'Yes. One organization can have many outlets. The menu is shared, and each outlet can change prices or mark items sold out on its own.',
               },
               {
                    q: 'Do I need special printers or hardware?',
                    a: 'No. The kitchen display runs on any tablet and the cashier screen on any laptop. Invoices and 80 mm receipts print from the browser to the printer you already have.',
               },
               {
                    q: 'What happens when the 14-day trial ends?',
                    a: 'Choose a plan to keep going — nothing is deleted. You can build your menu and take cash orders straight away; online payments switch on after a quick verification by our team.',
               },
          ],
     },
     finalCta: {
          title: 'Put your menu on every table this week.',
          body: '14-day free trial · set up in 15 minutes · cancel anytime',
          primary: 'Start free trial',
          secondary: 'Talk to sales',
     },
     footer: {
          blurb: 'QR ordering, kitchen display and KHQR billing for restaurants in Cambodia. “Tok” is Khmer for table.',
          payments: 'KHQR · ABA PayWay · Visa · Mastercard · Cash',
          columns: { product: 'Product', company: 'Company', legal: 'Legal' },
          links: {
               features: 'Features',
               pricing: 'Pricing',
               chains: 'For chains',
               contact: 'Contact',
               telegram: 'Telegram',
               terms: 'Terms',
               privacy: 'Privacy',
          },
          rights: '© {year} tok-scan. All rights reserved.',
          tagline: 'Scan · Order · Pay',
     },
}
