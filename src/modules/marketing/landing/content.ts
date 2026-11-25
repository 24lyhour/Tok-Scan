/**
 * Landing page copy & data — source: Tok_UIUX_Design_Guide.pdf p.21–22, p.26.
 * Keep all marketing text here so components stay presentational and Khmer (km) can be added later.
 */

export const links = {
     /** Every primary CTA leads into onboarding step 1 (guide p.21 "One goal per page") */
     signup: '/signup',
     login: '/admin',
     // Guide p.21–22: demos and sales go through Telegram @tokscan — confirm the handle before launch
     demo: 'https://t.me/LyhourKouch',
     telegram: 'https://t.me/LyhourKouch',
     telegramHandle: '@LyhourKouch',
     //  telegramHandle: '@LyhourKouch',
} as const

export const nav = [
     { label: 'Features', href: '#features' },
     { label: 'How it works', href: '#how-it-works' },
     { label: 'Pricing', href: '#pricing' },
     { label: 'For chains', href: '#chains' },
     { label: 'FAQ', href: '#faq' },
] as const

export const hero = {
     eyebrow: 'QR ordering & billing for Cambodian restaurants',
     titleLine1: 'Scan. Order. Pay.',
     titleLine2: 'Every table.',
     body: 'Guests order from their phone, the kitchen sees it instantly, and bills are paid by KHQR before they ask for the check — across one restaurant or twenty outlets.',
     bodyShort: 'Guests order from their phone and pay by KHQR — no app, no waiting for the check.',
     primaryCta: 'Start 14-day free trial',
     secondaryCta: 'Book a demo',
     checks: ['No card needed', 'Set up in 15 minutes', 'Khmer & English'],
     payments: ['KHQR', 'ABA PayWay', 'Visa · Mastercard', 'Cash'],
} as const

// TODO(before launch): replace with real customers who agreed to be listed.
export const socialProof = {
     label: 'Restaurants already serving with tok·scan',
     names: [
          'Mahob Group',
          'Kafe Sabay',
          'Lotus Bakery',
          'Riverside Kitchen Co.',
          'Sen Sok Eatery',
     ],
} as const

export const steps = [
     {
          title: 'Guests scan',
          body: 'Every table has its own QR code. The menu opens in the browser — nothing to install, table already known.',
          icon: 'scan',
     },
     {
          title: 'Kitchen cooks',
          body: 'Orders land on the kitchen display in seconds, with notes and allergies in amber. No more lost paper tickets.',
          icon: 'chef',
     },
     {
          title: 'Pay by KHQR',
          body: 'All orders roll into one bill. Guests pay with KHQR, ABA, card or cash — marked paid only after the bank confirms.',
          icon: 'pay',
     },
] as const

export const features = [
     {
          title: 'QR menu & ordering',
          body: 'Photos, options, add-ons, sold-out states and a cart that sits in the thumb zone.',
          icon: 'menu',
     },
     {
          title: 'Kitchen display',
          body: 'Live tickets by station, overdue alerts, and a sound on every new order.',
          icon: 'kitchen',
     },
     {
          title: 'Cashier & split bills',
          body: 'Split equally, by item or custom. Change is shown in USD and riel.',
          icon: 'split',
     },
     {
          title: 'KHQR & ABA PayWay',
          body: 'Dynamic QR per bill, auto-verified. Duplicate payments are blocked.',
          icon: 'qr',
     },
     {
          title: 'Multi-outlet',
          body: 'One menu for the whole group, with prices and stock per branch.',
          icon: 'outlets',
     },
     {
          title: 'Sales reports',
          body: 'Revenue, best sellers, peak hours and payment mix — export to CSV or PDF.',
          icon: 'reports',
     },
] as const

export type BillingCycle = 'monthly' | 'yearly'

export type Plan = {
     id: 'starter' | 'growth' | 'premium' | 'chain'
     name: string
     /** USD per month, billed monthly. null = custom pricing */
     monthly: number | null
     limits: string
     features: string[]
     cta: string
     href: string
     badge?: string
     highlight?: 'primary' | 'premium'
}

/** Yearly = 2 months free, shown as the per-month equivalent */
export const yearlyMonthsCharged = 10

// Sample prices from the design guide (p.26) — confirm before launch.
export const plans: Plan[] = [
     {
          id: 'starter',
          name: 'Starter',
          monthly: 19,
          limits: '1 outlet · 15 tables · 5 staff',
          features: ['QR menu & ordering', 'Kitchen & cashier', 'KHQR & cash'],
          cta: 'Start free trial',
          href: links.signup,
     },
     {
          id: 'growth',
          name: 'Growth',
          monthly: 49,
          limits: '3 outlets · 60 tables · 25 staff',
          features: ['Everything in Starter', 'Split & partial bills', 'Reports & exports'],
          cta: 'Start free trial',
          href: links.signup,
          badge: 'Most popular',
          highlight: 'primary',
     },
     {
          id: 'premium',
          name: 'Premium',
          monthly: 89,
          limits: '5 outlets · 150 tables · 50 staff',
          features: [
               'Everything in Growth',
               'Custom domain · no tok·scan footer',
               'Advanced analytics & loyalty',
               'Priority support',
          ],
          cta: 'Start free trial',
          href: links.signup,
          badge: '✦ Premium',
          highlight: 'premium',
     },
     {
          id: 'chain',
          name: 'Chain',
          monthly: null,
          limits: 'Unlimited outlets · API',
          features: [
               'Everything in Premium',
               'API & accounting integrations',
               'Dedicated manager & SLA',
          ],
          cta: 'Talk to sales',
          href: links.demo,
     },
]

export const chains = {
     eyebrow: 'For chains',
     title: 'One menu. Every branch. One login.',
     body: 'Run every outlet from one organization: shared menu with per-branch prices and stock, a role per outlet for each staff member, and reports across the whole group.',
     points: [
          'Switch between outlets from the sidebar',
          'Manager at one branch, cashier at another — one account',
          'Each branch can use its own KHQR merchant ID',
          'Custom domain on Premium & Chain',
     ],
     outlets: [
          { name: 'BKK1', area: 'Street 240, Phnom Penh', tables: 16, staff: 9 },
          { name: 'Riverside', area: 'Sisowath Quay', tables: 12, staff: 6 },
          { name: 'Aeon Mall 2', area: 'Sen Sok, food court', tables: 10, staff: 5 },
     ],
} as const

export const faq = [
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
] as const

export const finalCta = {
     title: 'Put your menu on every table this week.',
     body: '14-day free trial · set up in 15 minutes · cancel anytime',
     primary: 'Start free trial',
     secondary: 'Talk to sales',
} as const

export const footer = {
     blurb: 'QR ordering, kitchen display and KHQR billing for restaurants in Cambodia. “Tok” is Khmer for table.',
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
                    { label: 'Telegram', href: links.telegram },
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
} as const
