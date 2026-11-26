/** Organization options and limits — plain values, safe to import in client forms. */
/** 'other' = the owner types their own (stored in businessTypeOther) */
export const BUSINESS_TYPES = ['restaurant', 'cafe', 'bar', 'food_court', 'other'] as const
export type BusinessType = (typeof BUSINESS_TYPES)[number]

export const ORG_STATUSES = ['trial', 'pending_approval', 'active', 'suspended', 'closed'] as const

/** Onboarding progress, in order (guide p.23). `done` = finished. */
export const ONBOARDING_STEPS = ['organization', 'outlet', 'tables', 'done'] as const
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]

/** Brand colours offered in onboarding (guide p.23) — all pass WCAG AA with white text. */
export const BRAND_COLORS = {
     green: '#14513F',
     maroon: '#7A2E3A',
     blue: '#1D4ED8',
     orange: '#B4431A',
     ink: '#16181D',
} as const
export type BrandColorId = keyof typeof BRAND_COLORS
export type BrandColor = (typeof BRAND_COLORS)[BrandColorId]
export const BRAND_COLOR_VALUES = Object.values(BRAND_COLORS) as BrandColor[]
export const DEFAULT_BRAND_COLOR: BrandColor = BRAND_COLORS.green

export const ORGANIZATION_LIMITS = { name: 80, code: 6, businessTypeOther: 40 } as const
