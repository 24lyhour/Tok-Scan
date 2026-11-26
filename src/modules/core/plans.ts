/**
 * Plan limits (design guide p.26) — the ONE place these numbers live. Used by the pricing page
 * and to enforce limits (tables in onboarding now; outlets and staff when those screens exist).
 * Prices are still in marketing/landing/content/data.ts; both move to Module 15 (Subscription).
 */
export const PLAN_IDS = ['starter', 'growth', 'premium', 'chain'] as const
export type PlanId = (typeof PLAN_IDS)[number]

/** Product names — the same in every language */
export const PLAN_NAMES: Record<PlanId, string> = {
     starter: 'Starter',
     growth: 'Growth',
     premium: 'Premium',
     chain: 'Chain',
}

export type PlanLimits = { outlets: number; tables: number; staff: number }

export const PLAN_LIMITS: Record<PlanId, PlanLimits | null> = {
     starter: { outlets: 1, tables: 15, staff: 5 },
     growth: { outlets: 3, tables: 60, staff: 25 },
     premium: { outlets: 5, tables: 150, staff: 50 },
     /** Custom contract — no fixed limits */
     chain: null,
}

/**
 * The 14-day free trial: enough to try QR ordering in one outlet (decided 2026-11-26 — replaces
 * "trial = Growth"). Upgrading lifts these limits.
 */
export const TRIAL_LIMITS: PlanLimits = { outlets: 1, tables: 5, staff: 3 }

/** Limits a plan-limited resource can be checked against */
export type LimitedResource = keyof PlanLimits

/**
 * Limits for an organization, or null for no fixed limit. Organizations don't store a plan yet
 * (Module 15), so everyone is on the free trial for now.
 */
export function limitsFor(_organization?: { status?: string | null }): PlanLimits | null {
     return TRIAL_LIMITS
}
