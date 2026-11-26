/**
 * Module 14 — Organization / Tenant
 * Spec: docs/modules/14-organization-tenant.md
 *
 *   collections/  data: users · organizations · outlets     (backend entry: payload.ts)
 *   auth/         login (email + Google)
 *   onboarding/   sign-up steps 1–4 + go-live checklist
 *   shared/       auth shell + social sign-in (auth and onboarding)
 *   plugin.ts     multi-tenant plugin   ·   access rules: @/modules/core
 *
 * Public API — what routes in src/app import.
 */
export * from './auth'
export {
     DEFAULT_BRAND_COLOR,
     ORG_STATUSES,
     type OrgStatus,
} from './collections/organizations/constants'
export * from './onboarding'
