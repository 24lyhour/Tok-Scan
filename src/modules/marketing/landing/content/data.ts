/**
 * Landing page DATA — links, prices, ids and numbers. Shared by every language, never translated.
 * Source: Tok_UIUX_Design_Guide.pdf p.21–22, p.26.
 */

export const links = {
     /** Every primary CTA leads into onboarding step 1 (guide p.21 "One goal per page") */
     signup: '/signup',
     login: '/login',
     // Guide p.21–22: demos and sales go through Telegram
     demo: 'https://t.me/LyhourKouch',
     telegram: 'https://t.me/LyhourKouch',
     telegramHandle: '@LyhourKouch',
} as const

export const navItems = [
     { id: 'features', href: '#features' },
     { id: 'how', href: '#how-it-works' },
     { id: 'pricing', href: '#pricing' },
     { id: 'chains', href: '#chains' },
     { id: 'faq', href: '#faq' },
] as const

export const stepIds = ['scan', 'cook', 'pay'] as const
export const featureIds = ['menu', 'kitchen', 'split', 'khqr', 'outlets', 'reports'] as const

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

/** Sample organization in the "For chains" diagram (guide p.20). */
export const sampleOutlets = [
     { id: 'bkk1', name: 'BKK1', tables: 16, staff: 9 },
     { id: 'riverside', name: 'Riverside', tables: 12, staff: 6 },
     { id: 'aeon', name: 'Aeon Mall 2', tables: 10, staff: 5 },
] as const

export const footerColumns = [
     {
          id: 'product',
          links: [
               { id: 'features', href: '#features' },
               { id: 'pricing', href: '#pricing' },
               { id: 'chains', href: '#chains' },
          ],
     },
     {
          id: 'company',
          links: [
               { id: 'contact', href: '#contact' },
               { id: 'telegram', href: links.telegram },
          ],
     },
     {
          id: 'legal',
          links: [
               { id: 'terms', href: '/terms' },
               { id: 'privacy', href: '/privacy' },
          ],
     },
] as const
