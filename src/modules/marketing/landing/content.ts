/**
 * Landing page copy & data — source: Tok_UIUX_Design_Guide.pdf p.21–22, p.26.
 * Text lives in `en` and `km` (same shape, type-checked). Links and prices are shared.
 * Khmer copy: have a native speaker review before launch.
 */
import type { Translations } from '@/shared/i18n/site-locale'

export const links = {
     /** Every primary CTA leads into onboarding step 1 (guide p.21 "One goal per page") */
     signup: '/signup',
     login: '/login',
     // Guide p.21–22: demos and sales go through Telegram
     demo: 'https://t.me/LyhourKouch',
     telegram: 'https://t.me/LyhourKouch',
     telegramHandle: '@LyhourKouch',
} as const

export const navTargets = ['#features', '#how-it-works', '#pricing', '#chains', '#faq'] as const

export type BillingCycle = 'monthly' | 'yearly'
export type PlanId = 'starter' | 'growth' | 'premium' | 'chain'

export type Plan = {
     id: PlanId
     name: string
     /** USD per month, billed monthly. null = custom pricing */
     monthly: number | null
     href: string
     highlight?: 'primary' | 'premium'
}

/** Yearly = 2 months free, shown as the per-month equivalent */
export const yearlyMonthsCharged = 10

// Sample prices from the design guide (p.26) — confirm before launch.
export const plans: Plan[] = [
     { id: 'starter', name: 'Starter', monthly: 19, href: links.signup },
     { id: 'growth', name: 'Growth', monthly: 49, href: links.signup, highlight: 'primary' },
     { id: 'premium', name: 'Premium', monthly: 89, href: links.signup, highlight: 'premium' },
     { id: 'chain', name: 'Chain', monthly: null, href: links.demo },
]

// TODO(before launch): replace with real customers who agreed to be listed.
export const customerNames = [
     'Mahob Group',
     'Kafe Sabay',
     'Lotus Bakery',
     'Riverside Kitchen Co.',
     'Sen Sok Eatery',
]

const en = {
     meta: {
          title: 'tok·scan — QR ordering & billing for Cambodian restaurants',
          description:
               'Guests order from their phone, the kitchen sees it instantly, and bills are paid by KHQR. One restaurant or twenty outlets.',
     },
     common: {
          skipToContent: 'Skip to content',
          home: 'tok-scan home',
          language: 'Language',
     },
     header: {
          nav: ['Features', 'How it works', 'Pricing', 'For chains', 'FAQ'],
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
     },
     socialProof: {
          label: 'Restaurants already serving with tok·scan',
          region: 'Customers',
     },
     how: {
          eyebrow: 'How it works',
          title: 'From table to paid in three taps',
          body: 'No app for guests, no new hardware for you. If you have phones and a tablet, you can start tonight.',
          steps: [
               {
                    title: 'Guests scan',
                    body: 'Every table has its own QR code. The menu opens in the browser — nothing to install, table already known.',
               },
               {
                    title: 'Kitchen cooks',
                    body: 'Orders land on the kitchen display in seconds, with notes and allergies in amber. No more lost paper tickets.',
               },
               {
                    title: 'Pay by KHQR',
                    body: 'All orders roll into one bill. Guests pay with KHQR, ABA, card or cash — marked paid only after the bank confirms.',
               },
          ],
     },
     features: {
          eyebrow: 'Features',
          title: 'Everything a busy floor needs',
          compare: 'Compare plans',
          items: [
               {
                    title: 'QR menu & ordering',
                    body: 'Photos, options, add-ons, sold-out states and a cart that sits in the thumb zone.',
               },
               {
                    title: 'Kitchen display',
                    body: 'Live tickets by station, overdue alerts, and a sound on every new order.',
               },
               {
                    title: 'Cashier & split bills',
                    body: 'Split equally, by item or custom. Change is shown in USD and riel.',
               },
               {
                    title: 'KHQR & ABA PayWay',
                    body: 'Dynamic QR per bill, auto-verified. Duplicate payments are blocked.',
               },
               {
                    title: 'Multi-outlet',
                    body: 'One menu for the whole group, with prices and stock per branch.',
               },
               {
                    title: 'Sales reports',
                    body: 'Revenue, best sellers, peak hours and payment mix — export to CSV or PDF.',
               },
          ],
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
          outletStats: '{tables} tables · {staff} staff',
          outlets: [
               { name: 'BKK1', area: 'Street 240, Phnom Penh', tables: 16, staff: 9 },
               { name: 'Riverside', area: 'Sisowath Quay', tables: 12, staff: 6 },
               { name: 'Aeon Mall 2', area: 'Sen Sok, food court', tables: 10, staff: 5 },
          ],
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
          billedYearly: '${amount} billed yearly',
          billedMonthly: 'Billed monthly',
          volume: 'Volume pricing',
          custom: 'Custom',
          note: 'Prices in USD. Guest payments (KHQR, ABA, card, cash) go straight to your own merchant account — tok·scan only bills the subscription.',
          plans: {
               starter: {
                    limits: '1 outlet · 15 tables · 5 staff',
                    features: ['QR menu & ordering', 'Kitchen & cashier', 'KHQR & cash'],
                    cta: 'Start free trial',
                    badge: '',
               },
               growth: {
                    limits: '3 outlets · 60 tables · 25 staff',
                    features: [
                         'Everything in Starter',
                         'Split & partial bills',
                         'Reports & exports',
                    ],
                    cta: 'Start free trial',
                    badge: 'Most popular',
               },
               premium: {
                    limits: '5 outlets · 150 tables · 50 staff',
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
          columns: [
               {
                    title: 'Product',
                    links: [
                         { label: 'Features', href: '#features' },
                         { label: 'Pricing', href: '#pricing' },
                         { label: 'For chains', href: '#chains' },
                    ],
               },
               {
                    title: 'Company',
                    links: [
                         { label: 'Contact', href: '#contact' },
                         { label: 'Telegram', href: links.telegram as string },
                    ],
               },
               {
                    title: 'Legal',
                    links: [
                         { label: 'Terms', href: '/terms' },
                         { label: 'Privacy', href: '/privacy' },
                    ],
               },
          ],
          rights: '© {year} tok-scan. All rights reserved.',
          tagline: 'Scan · Order · Pay',
     },
}

export type LandingContent = typeof en

const km: LandingContent = {
     meta: {
          title: 'tok·scan — ការកុម្ម៉ង់ និងទូទាត់តាម QR សម្រាប់ភោជនីយដ្ឋានកម្ពុជា',
          description:
               'ភ្ញៀវកុម្ម៉ង់ពីទូរស័ព្ទ ផ្ទះបាយឃើញភ្លាមៗ ហើយវិក្កយបត្រទូទាត់តាម KHQR។ ភោជនីយដ្ឋានមួយ ឬម្ភៃសាខា។',
     },
     common: {
          skipToContent: 'រំលងទៅមាតិកា',
          home: 'ទំព័រដើម tok-scan',
          language: 'ភាសា',
     },
     header: {
          nav: ['មុខងារ', 'របៀបដំណើរការ', 'តម្លៃ', 'ហាងច្រើនសាខា', 'សំណួរញឹកញាប់'],
          login: 'ចូលគណនី',
          startTrial: 'សាកល្បងឥតគិតថ្លៃ',
          freeTrial: 'សាកល្បង',
          openMenu: 'បើកម៉ឺនុយ',
          closeMenu: 'បិទម៉ឺនុយ',
          menu: 'ម៉ឺនុយ',
          mainNav: 'ម៉ឺនុយមេ',
          premiumTeaser: 'សាខា ៥ · ដែនផ្ទាល់ខ្លួន · វិភាគកម្រិតខ្ពស់',
          perMonth: '/ ខែ',
          questions: 'មានសំណួរ? Telegram',
     },
     hero: {
          eyebrow: 'ការកុម្ម៉ង់ និងទូទាត់តាម QR សម្រាប់ភោជនីយដ្ឋានកម្ពុជា',
          titleLine1: 'ស្កេន។ កុម្ម៉ង់។ ទូទាត់។',
          titleLine2: 'គ្រប់តុ។',
          body: 'ភ្ញៀវកុម្ម៉ង់ពីទូរស័ព្ទរបស់ពួកគេ ផ្ទះបាយឃើញភ្លាមៗ ហើយវិក្កយបត្រត្រូវបានទូទាត់តាម KHQR មុនពេលភ្ញៀវសុំគិតលុយ — ទោះមានភោជនីយដ្ឋានមួយ ឬម្ភៃសាខាក៏ដោយ។',
          bodyShort: 'ភ្ញៀវកុម្ម៉ង់ពីទូរស័ព្ទ ហើយទូទាត់តាម KHQR — មិនចាំបាច់ដំឡើងកម្មវិធី មិនចាំបាច់រង់ចាំគិតលុយ។',
          primaryCta: 'សាកល្បងឥតគិតថ្លៃ ១៤ ថ្ងៃ',
          secondaryCta: 'ស្នើសុំការបង្ហាញ',
          checks: ['មិនត្រូវការកាត', 'រៀបចំរួចក្នុង ១៥ នាទី', 'ខ្មែរ និងអង់គ្លេស'],
          paymentsLabel: 'វិធីទូទាត់ដែលគាំទ្រ',
          payments: ['KHQR', 'ABA PayWay', 'Visa · Mastercard', 'សាច់ប្រាក់'],
          visualLabel:
               'tok-scan នៅលើទូរស័ព្ទភ្ញៀវ៖ កាតម៉ឺនុយអាម៉ុកត្រី វិក្កយបត្រ KHQR ដែលបានបង់ និងសំបុត្រផ្ទះបាយសម្រាប់តុលេខ ៧',
     },
     socialProof: {
          label: 'ភោជនីយដ្ឋានដែលកំពុងប្រើ tok·scan',
          region: 'អតិថិជន',
     },
     how: {
          eyebrow: 'របៀបដំណើរការ',
          title: 'ពីតុ ដល់ការទូទាត់ ក្នុងបីជំហាន',
          body: 'ភ្ញៀវមិនចាំបាច់ដំឡើងកម្មវិធី ហើយអ្នកមិនចាំបាច់ទិញឧបករណ៍ថ្មី។ បើមានទូរស័ព្ទ និងថេប្លេត អ្នកអាចចាប់ផ្តើមបានយប់នេះ។',
          steps: [
               {
                    title: 'ភ្ញៀវស្កេន',
                    body: 'តុនីមួយៗមានកូដ QR ផ្ទាល់ខ្លួន។ ម៉ឺនុយបើកក្នុងកម្មវិធីរុករក — មិនចាំបាច់ដំឡើងអ្វីទេ ហើយប្រព័ន្ធស្គាល់លេខតុស្រាប់។',
               },
               {
                    title: 'ផ្ទះបាយចម្អិន',
                    body: 'ការកុម្ម៉ង់ចូលដល់អេក្រង់ផ្ទះបាយក្នុងប៉ុន្មានវិនាទី ព្រមទាំងកំណត់ចំណាំ និងអាឡែហ្ស៊ីជាពណ៌លឿង។ លែងបាត់ក្រដាសកុម្ម៉ង់ទៀតហើយ។',
               },
               {
                    title: 'ទូទាត់តាម KHQR',
                    body: 'ការកុម្ម៉ង់ទាំងអស់បញ្ចូលគ្នាជាវិក្កយបត្រតែមួយ។ ភ្ញៀវទូទាត់តាម KHQR, ABA, កាត ឬសាច់ប្រាក់ — បញ្ជាក់ថាបានបង់ លុះត្រាតែធនាគារបញ្ជាក់។',
               },
          ],
     },
     features: {
          eyebrow: 'មុខងារ',
          title: 'អ្វីៗដែលហាងមមាញឹកត្រូវការ',
          compare: 'ប្រៀបធៀបគម្រោង',
          items: [
               {
                    title: 'ម៉ឺនុយ QR និងការកុម្ម៉ង់',
                    body: 'រូបភាព ជម្រើស គ្រឿងបន្ថែម ស្ថានភាពអស់ស្តុក និងកន្ត្រកដែលងាយចុចដោយមេដៃ។',
               },
               {
                    title: 'អេក្រង់ផ្ទះបាយ',
                    body: 'សំបុត្រកុម្ម៉ង់ផ្ទាល់តាមផ្នែក ការជូនដំណឹងពេលយឺត និងសំឡេងរាល់ការកុម្ម៉ង់ថ្មី។',
               },
               {
                    title: 'បេឡា និងការបំបែកវិក្កយបត្រ',
                    body: 'បំបែកស្មើៗគ្នា តាមមុខម្ហូប ឬតាមចំនួនកំណត់។ លុយអាប់បង្ហាញជាដុល្លារ និងរៀល។',
               },
               {
                    title: 'KHQR និង ABA PayWay',
                    body: 'QR ថ្មីសម្រាប់វិក្កយបត្រនីមួយៗ ផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិ។ ការទូទាត់ស្ទួនត្រូវបានរារាំង។',
               },
               {
                    title: 'ច្រើនសាខា',
                    body: 'ម៉ឺនុយតែមួយសម្រាប់ក្រុមទាំងមូល ដោយមានតម្លៃ និងស្តុកតាមសាខានីមួយៗ។',
               },
               {
                    title: 'របាយការណ៍លក់',
                    body: 'ចំណូល មុខម្ហូបលក់ដាច់ ម៉ោងមមាញឹក និងវិធីទូទាត់ — នាំចេញជា CSV ឬ PDF។',
               },
          ],
     },
     chains: {
          eyebrow: 'សម្រាប់ហាងច្រើនសាខា',
          title: 'ម៉ឺនុយតែមួយ។ គ្រប់សាខា។ គណនីតែមួយ។',
          body: 'គ្រប់គ្រងគ្រប់សាខាពីស្ថាប័នតែមួយ៖ ម៉ឺនុយរួមដែលមានតម្លៃ និងស្តុកតាមសាខា តួនាទីតាមសាខាសម្រាប់បុគ្គលិកម្នាក់ៗ និងរបាយការណ៍សម្រាប់ក្រុមទាំងមូល។',
          points: [
               'ប្តូររវាងសាខាពីរបារចំហៀង',
               'ជាអ្នកគ្រប់គ្រងនៅសាខាមួយ ជាអ្នកគិតលុយនៅសាខាមួយទៀត — គណនីតែមួយ',
               'សាខានីមួយៗអាចប្រើ Merchant ID KHQR ផ្ទាល់ខ្លួន',
               'ដែនផ្ទាល់ខ្លួនសម្រាប់គម្រោង Premium និង Chain',
          ],
          diagramLabel: 'ឧទាហរណ៍ស្ថាប័នដែលមានបីសាខា',
          platform: 'វេទិកា tok·scan',
          platformSub: 'គម្រោង · ការអនុម័ត · ដៃគូទូទាត់',
          organization: 'ស្ថាប័ន — “Mahob Group”',
          organizationSub: 'ម្ចាស់ និងសមាជិក · ម៉ឺនុយរួម · ឡូហ្គោ និងពណ៌',
          outletStats: 'តុ {tables} · បុគ្គលិក {staff}',
          outlets: [
               { name: 'BKK1', area: 'ផ្លូវ ២៤០ ភ្នំពេញ', tables: 16, staff: 9 },
               { name: 'Riverside', area: 'មាត់ទន្លេ ស៊ីសុវត្ថិ', tables: 12, staff: 6 },
               { name: 'Aeon Mall 2', area: 'សែនសុខ · តំបន់អាហារ', tables: 10, staff: 5 },
          ],
          note: 'ភោជនីយដ្ឋានតែមួយ គឺជាស្ថាប័នដែលមានសាខាតែមួយ — មិនចាំបាច់ផ្លាស់ប្តូរទិន្នន័យទេ ពេលអ្នកបើកសាខាទីពីរ។',
     },
     pricing: {
          eyebrow: 'តម្លៃ',
          title: 'គម្រោងសាមញ្ញសម្រាប់ស្ថាប័ននីមួយៗ',
          body: 'គ្រប់គម្រោងចាប់ផ្តើមដោយការសាកល្បងឥតគិតថ្លៃ ១៤ ថ្ងៃ។ បន្ថែមសាខាតាមការរីកចម្រើនរបស់អ្នក។',
          billingPeriod: 'រយៈពេលបង់ប្រាក់',
          monthly: 'ប្រចាំខែ',
          yearly: 'ប្រចាំឆ្នាំ',
          yearlyNote: 'ឥតគិតថ្លៃ ២ ខែ',
          perMonth: '/ ខែ',
          billedYearly: '${amount} បង់ម្តងក្នុងមួយឆ្នាំ',
          billedMonthly: 'បង់ប្រចាំខែ',
          volume: 'តម្លៃតាមបរិមាណ',
          custom: 'តាមតម្រូវការ',
          note: 'តម្លៃគិតជាដុល្លារអាមេរិក។ ការទូទាត់របស់ភ្ញៀវ (KHQR, ABA, កាត, សាច់ប្រាក់) ចូលទៅគណនីអាជីវកររបស់អ្នកផ្ទាល់ — tok·scan គិតថ្លៃតែការជាវប៉ុណ្ណោះ។',
          plans: {
               starter: {
                    limits: 'សាខា ១ · តុ ១៥ · បុគ្គលិក ៥',
                    features: ['ម៉ឺនុយ QR និងការកុម្ម៉ង់', 'ផ្ទះបាយ និងបេឡា', 'KHQR និងសាច់ប្រាក់'],
                    cta: 'សាកល្បងឥតគិតថ្លៃ',
                    badge: '',
               },
               growth: {
                    limits: 'សាខា ៣ · តុ ៦០ · បុគ្គលិក ២៥',
                    features: [
                         'អ្វីៗទាំងអស់ក្នុង Starter',
                         'បំបែកវិក្កយបត្រ និងបង់ជាផ្នែក',
                         'របាយការណ៍ និងការនាំចេញ',
                    ],
                    cta: 'សាកល្បងឥតគិតថ្លៃ',
                    badge: 'ពេញនិយមបំផុត',
               },
               premium: {
                    limits: 'សាខា ៥ · តុ ១៥០ · បុគ្គលិក ៥០',
                    features: [
                         'អ្វីៗទាំងអស់ក្នុង Growth',
                         'ដែនផ្ទាល់ខ្លួន · គ្មានបដា tok·scan',
                         'វិភាគកម្រិតខ្ពស់ និងកម្មវិធីភក្តីភាព',
                         'ជំនួយអាទិភាព',
                    ],
                    cta: 'សាកល្បងឥតគិតថ្លៃ',
                    badge: '✦ Premium',
               },
               chain: {
                    limits: 'សាខាគ្មានដែនកំណត់ · API',
                    features: [
                         'អ្វីៗទាំងអស់ក្នុង Premium',
                         'ភ្ជាប់ API និងប្រព័ន្ធគណនេយ្យ',
                         'អ្នកគ្រប់គ្រងផ្ទាល់ និង SLA',
                    ],
                    cta: 'ពិភាក្សាជាមួយផ្នែកលក់',
                    badge: '',
               },
          },
     },
     faq: {
          eyebrow: 'សំណួរញឹកញាប់',
          title: 'សំណួរដែលម្ចាស់ហាងតែងសួរ',
          curious: 'នៅមានចម្ងល់? ផ្ញើសារមកយើងតាម',
          items: [
               {
                    q: 'តើភ្ញៀវត្រូវដំឡើងកម្មវិធីទេ?',
                    a: 'ទេ។ ភ្ញៀវស្កេនកូដ QR នៅលើតុ ហើយម៉ឺនុយបើកក្នុងកម្មវិធីរុករកនៃទូរស័ព្ទរបស់ពួកគេ។ វាដំណើរការលើស្មាតហ្វូនគ្រប់ប្រភេទ ជាភាសាខ្មែរ ឬអង់គ្លេស។',
               },
               {
                    q: 'តើលុយពីការទូទាត់របស់ភ្ញៀវចូលដល់ខ្ញុំនៅពេលណា?',
                    a: 'ការទូទាត់តាម KHQR, ABA ឬកាត ចូលត្រង់ទៅគណនីអាជីវកររបស់អ្នក — tok·scan មិនដែលកាន់លុយរបស់អ្នកទេ។ យើងគិតថ្លៃតែការជាវប្រចាំខែប៉ុណ្ណោះ។',
               },
               {
                    q: 'តើខ្ញុំអាចគ្រប់គ្រងសាខាច្រើនដោយប្រើម៉ឺនុយតែមួយបានទេ?',
                    a: 'បាន។ ស្ថាប័នមួយអាចមានសាខាច្រើន។ ម៉ឺនុយប្រើរួមគ្នា ហើយសាខានីមួយៗអាចប្តូរតម្លៃ ឬកំណត់មុខម្ហូបថាអស់ដោយខ្លួនឯង។',
               },
               {
                    q: 'តើខ្ញុំត្រូវការម៉ាស៊ីនព្រីន ឬឧបករណ៍ពិសេសទេ?',
                    a: 'ទេ។ អេក្រង់ផ្ទះបាយដំណើរការលើថេប្លេតណាមួយ ហើយអេក្រង់បេឡាដំណើរការលើកុំព្យូទ័រយួរដៃណាមួយ។ វិក្កយបត្រ និងបង្កាន់ដៃ 80 មម ព្រីនចេញពីកម្មវិធីរុករក ទៅម៉ាស៊ីនព្រីនដែលអ្នកមានស្រាប់។',
               },
               {
                    q: 'តើមានអ្វីកើតឡើង ពេលការសាកល្បង ១៤ ថ្ងៃបញ្ចប់?',
                    a: 'ជ្រើសរើសគម្រោងមួយដើម្បីបន្ត — គ្មានអ្វីត្រូវបានលុបទេ។ អ្នកអាចបង្កើតម៉ឺនុយ និងទទួលការកុម្ម៉ង់ជាសាច់ប្រាក់បានភ្លាមៗ។ ការទូទាត់អនឡាញនឹងបើក បន្ទាប់ពីក្រុមការងាររបស់យើងផ្ទៀងផ្ទាត់រួច។',
               },
          ],
     },
     finalCta: {
          title: 'ដាក់ម៉ឺនុយរបស់អ្នកនៅលើគ្រប់តុ ក្នុងសប្តាហ៍នេះ។',
          body: 'សាកល្បងឥតគិតថ្លៃ ១៤ ថ្ងៃ · រៀបចំរួចក្នុង ១៥ នាទី · បោះបង់បានគ្រប់ពេល',
          primary: 'សាកល្បងឥតគិតថ្លៃ',
          secondary: 'ពិភាក្សាជាមួយផ្នែកលក់',
     },
     footer: {
          blurb: 'ការកុម្ម៉ង់តាម QR អេក្រង់ផ្ទះបាយ និងការទូទាត់ KHQR សម្រាប់ភោជនីយដ្ឋាននៅកម្ពុជា។ ឈ្មោះ “tok” មកពីពាក្យខ្មែរ “តុ”។',
          payments: 'KHQR · ABA PayWay · Visa · Mastercard · សាច់ប្រាក់',
          columns: [
               {
                    title: 'ផលិតផល',
                    links: [
                         { label: 'មុខងារ', href: '#features' },
                         { label: 'តម្លៃ', href: '#pricing' },
                         { label: 'ហាងច្រើនសាខា', href: '#chains' },
                    ],
               },
               {
                    title: 'ក្រុមហ៊ុន',
                    links: [
                         { label: 'ទំនាក់ទំនង', href: '#contact' },
                         { label: 'Telegram', href: links.telegram },
                    ],
               },
               {
                    title: 'ច្បាប់',
                    links: [
                         { label: 'លក្ខខណ្ឌប្រើប្រាស់', href: '/terms' },
                         { label: 'ឯកជនភាព', href: '/privacy' },
                    ],
               },
          ],
          rights: '© {year} tok-scan។ រក្សាសិទ្ធិគ្រប់យ៉ាង។',
          tagline: 'ស្កេន · កុម្ម៉ង់ · ទូទាត់',
     },
}

const zh: LandingContent = {
     meta: {
          title: 'tok·scan — 柬埔寨餐厅的扫码点餐与结账系统',
          description:
               '顾客用手机点餐，厨房即时看到，账单通过 KHQR 支付。一家餐厅或二十家门店皆适用。',
     },
     common: {
          skipToContent: '跳到主要内容',
          home: 'tok-scan 首页',
          language: '语言',
     },
     header: {
          nav: ['功能', '使用方式', '价格', '连锁门店', '常见问题'],
          login: '登录',
          startTrial: '免费试用',
          freeTrial: '免费试用',
          openMenu: '打开菜单',
          closeMenu: '关闭菜单',
          menu: '菜单',
          mainNav: '主导航',
          premiumTeaser: '5 家门店 · 自定义域名 · 高级分析',
          perMonth: '/ 月',
          questions: '有疑问？Telegram',
     },
     hero: {
          eyebrow: '为柬埔寨餐厅打造的扫码点餐与结账',
          titleLine1: '扫码。点餐。支付。',
          titleLine2: '每一张桌。',
          body: '顾客用手机点餐，厨房即时看到，账单在顾客要求结账前就已通过 KHQR 付清——无论是一家餐厅还是二十家门店。',
          bodyShort: '顾客用手机点餐并通过 KHQR 支付——无需下载应用，无需等待结账。',
          primaryCta: '免费试用 14 天',
          secondaryCta: '预约演示',
          checks: ['无需信用卡', '15 分钟完成设置', '支持高棉语和英语'],
          paymentsLabel: '支持的付款方式',
          payments: ['KHQR', 'ABA PayWay', 'Visa · Mastercard', '现金'],
          visualLabel:
               '顾客手机上的 tok-scan：阿莫克鱼菜单卡、已支付的 KHQR 账单，以及 7 号桌的厨房小票',
     },
     socialProof: {
          label: '已在使用 tok·scan 的餐厅',
          region: '客户',
     },
     how: {
          eyebrow: '使用方式',
          title: '从入座到付款，只需三步',
          body: '顾客无需安装应用，您也无需购买新设备。只要有手机和平板，今晚就能开始使用。',
          steps: [
               {
                    title: '顾客扫码',
                    body: '每张桌子都有专属二维码。菜单在浏览器中打开——无需安装，系统已知道桌号。',
               },
               {
                    title: '厨房制作',
                    body: '订单几秒内显示在厨房屏幕上，备注和过敏信息以琥珀色标出。再也不会丢失纸质单据。',
               },
               {
                    title: 'KHQR 支付',
                    body: '所有订单合并为一张账单。顾客可用 KHQR、ABA、银行卡或现金支付——银行确认后才标记为已付款。',
               },
          ],
     },
     features: {
          eyebrow: '功能',
          title: '繁忙餐厅所需的一切',
          compare: '比较方案',
          items: [
               {
                    title: '扫码菜单与点餐',
                    body: '照片、规格、加料、售罄状态，以及拇指易触的购物车。',
               },
               {
                    title: '厨房显示屏',
                    body: '按工位实时显示订单、超时提醒，每个新订单都有提示音。',
               },
               {
                    title: '收银与分单',
                    body: '可平均分摊、按菜品或自定义金额分单。找零以美元和瑞尔显示。',
               },
               {
                    title: 'KHQR 与 ABA PayWay',
                    body: '每张账单生成动态二维码，自动核验。重复付款会被拦截。',
               },
               { title: '多门店', body: '整个集团共用一份菜单，各门店可设置自己的价格和库存。' },
               {
                    title: '销售报表',
                    body: '营业额、畅销菜品、高峰时段和付款方式——可导出 CSV 或 PDF。',
               },
          ],
     },
     chains: {
          eyebrow: '连锁门店',
          title: '一份菜单。所有门店。一个账号。',
          body: '在一个组织中管理所有门店：共享菜单并按门店设置价格和库存，每位员工在各门店拥有各自的角色，并可查看整个集团的报表。',
          points: [
               '在侧边栏中切换门店',
               '在一家门店当经理，在另一家当收银员——同一个账号',
               '每家门店可使用自己的 KHQR 商户号',
               'Premium 和 Chain 方案支持自定义域名',
          ],
          diagramLabel: '包含三家门店的组织示例',
          platform: 'tok·scan 平台',
          platformSub: '方案 · 审核 · 支付合作伙伴',
          organization: '组织——“Mahob Group”',
          organizationSub: '所有者和成员 · 共享菜单 · 标志和颜色',
          outletStats: '{tables} 张桌 · {staff} 名员工',
          outlets: [
               { name: 'BKK1', area: '金边 240 街', tables: 16, staff: 9 },
               { name: 'Riverside', area: '西索瓦码头', tables: 12, staff: 6 },
               { name: 'Aeon Mall 2', area: '森速 · 美食广场', tables: 10, staff: 5 },
          ],
          note: '单店餐厅就是只有一家门店的组织——开第二家分店时无需迁移数据。',
     },
     pricing: {
          eyebrow: '价格',
          title: '按组织计费的简单方案',
          body: '所有方案均可免费试用 14 天。随业务增长添加门店。',
          billingPeriod: '计费周期',
          monthly: '按月',
          yearly: '按年',
          yearlyNote: '免 2 个月',
          perMonth: '/ 月',
          billedYearly: '每年 ${amount}',
          billedMonthly: '按月计费',
          volume: '按规模定价',
          custom: '定制',
          note: '价格以美元计。顾客付款（KHQR、ABA、银行卡、现金）直接进入您自己的商户账户——tok·scan 只收取订阅费。',
          plans: {
               starter: {
                    limits: '1 家门店 · 15 张桌 · 5 名员工',
                    features: ['扫码菜单与点餐', '厨房与收银', 'KHQR 与现金'],
                    cta: '免费试用',
                    badge: '',
               },
               growth: {
                    limits: '3 家门店 · 60 张桌 · 25 名员工',
                    features: ['包含 Starter 全部功能', '分单与部分付款', '报表与导出'],
                    cta: '免费试用',
                    badge: '最受欢迎',
               },
               premium: {
                    limits: '5 家门店 · 150 张桌 · 50 名员工',
                    features: [
                         '包含 Growth 全部功能',
                         '自定义域名 · 无 tok·scan 页脚',
                         '高级分析与会员积分',
                         '优先支持',
                    ],
                    cta: '免费试用',
                    badge: '✦ Premium',
               },
               chain: {
                    limits: '门店数量不限 · API',
                    features: ['包含 Premium 全部功能', 'API 与会计系统集成', '专属客户经理与 SLA'],
                    cta: '联系销售',
                    badge: '',
               },
          },
     },
     faq: {
          eyebrow: '常见问题',
          title: '餐厅老板常问的问题',
          curious: '还有疑问？欢迎通过以下方式联系我们：',
          items: [
               {
                    q: '顾客需要下载应用吗？',
                    a: '不需要。顾客扫描桌上的二维码，菜单就会在手机浏览器中打开。适用于任何智能手机，支持高棉语或英语。',
               },
               {
                    q: '顾客付款的钱什么时候到账？',
                    a: '通过 KHQR、ABA 或银行卡的付款会直接进入您自己的商户账户——tok·scan 从不经手您的资金。我们只收取每月订阅费。',
               },
               {
                    q: '我可以用一份菜单管理多家分店吗？',
                    a: '可以。一个组织可以有多家门店。菜单共享，每家门店都可以自行调整价格或将菜品标记为售罄。',
               },
               {
                    q: '我需要特殊的打印机或硬件吗？',
                    a: '不需要。厨房显示屏可在任何平板上运行，收银界面可在任何笔记本电脑上运行。发票和 80 毫米小票可直接从浏览器打印到您现有的打印机。',
               },
               {
                    q: '14 天试用结束后会怎样？',
                    a: '选择一个方案即可继续使用——不会删除任何数据。您可以立即创建菜单并接受现金订单；我们的团队快速审核后，即可开通在线支付。',
               },
          ],
     },
     finalCta: {
          title: '本周就把菜单放上每一张桌子。',
          body: '免费试用 14 天 · 15 分钟完成设置 · 随时取消',
          primary: '免费试用',
          secondary: '联系销售',
     },
     footer: {
          blurb: '面向柬埔寨餐厅的扫码点餐、厨房显示屏和 KHQR 结账系统。“Tok” 在高棉语中意为“桌子”。',
          payments: 'KHQR · ABA PayWay · Visa · Mastercard · 现金',
          columns: [
               {
                    title: '产品',
                    links: [
                         { label: '功能', href: '#features' },
                         { label: '价格', href: '#pricing' },
                         { label: '连锁门店', href: '#chains' },
                    ],
               },
               {
                    title: '公司',
                    links: [
                         { label: '联系我们', href: '#contact' },
                         { label: 'Telegram', href: links.telegram },
                    ],
               },
               {
                    title: '法律',
                    links: [
                         { label: '服务条款', href: '/terms' },
                         { label: '隐私政策', href: '/privacy' },
                    ],
               },
          ],
          rights: '© {year} tok-scan。保留所有权利。',
          tagline: '扫码 · 点餐 · 支付',
     },
}

export const landingContent: Translations<LandingContent> = { en, km, zh }
