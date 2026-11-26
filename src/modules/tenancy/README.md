# tenancy — Module 14: Organization / Tenant

Spec: [docs/modules/14-organization-tenant.md](../../../docs/modules/14-organization-tenant.md) · Design: guide p.20–23

**Organization** (a restaurant business = Payload tenant) → many **Outlets** (branches).
People belong to organizations through `users.tenants[]` with a role: `owner` · `admin` · `member`.

## Routes

| URL                                     | Page                                         | Folder                     |
| --------------------------------------- | -------------------------------------------- | -------------------------- |
| `/login`                                | Log in (email + Google)                      | `auth/login/`              |
| `/auth/google`, `/auth/google/callback` | Google sign-in                               | `auth/google/`             |
| `/signup`                               | Step 1 · account                             | `onboarding/signup/`       |
| `/onboarding`                           | Resume at the current step                   | `onboarding/resume.ts`     |
| `/onboarding/organization`              | Step 2 · business, web address, logo, colour | `onboarding/organization/` |
| `/onboarding/outlet`                    | Step 3 · first outlet, taxes, hours          | `onboarding/outlet/`       |
| `/onboarding/tables` (+ `/print`)       | Step 4 · tables + QR codes                   | `onboarding/tables/`       |
| `/dashboard`                            | "Get <restaurant> live" checklist            | `onboarding/go-live/`      |

## Who can do what

|                                           | owner / admin         | member (staff) | other restaurant |
| ----------------------------------------- | --------------------- | -------------- | ---------------- |
| Read organization, outlets                | ✅                    | ✅             | ❌               |
| Change organization, outlets              | ✅                    | ❌             | ❌               |
| Edit own profile                          | ✅                    | ✅             | —                |
| Change someone else's account or any role | ❌ (super-admin only) | ❌             | ❌               |

Rules: `@/modules/core` → `access.ts`. Onboarding actions write with `overrideAccess` after
`getOnboardingContext()` has checked the signed-in owner.

## Layout

`collections/` data · `auth/` and `onboarding/` screens (each step: `page · form · schema · actions`) ·
`shared/` auth shell + social sign-in · `plugin.ts` multi-tenant plugin.
Entry points: `index.ts` (pages for `src/app`) · `payload.ts` (collections + plugin, registry only).
