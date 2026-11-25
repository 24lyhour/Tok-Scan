# tok-scan — Product Docs

tok-scan is a multi-tenant SaaS for restaurants: QR menu ordering, kitchen display, cashier POS, billing and KHQR payments.

> **Naming rule:** the product is always **tok-scan**. "Mahob Kitchen & Bar" in the design guide is only a sample restaurant, so it is tenant data and never the product name.

## Sources of truth

| What | Where |
|---|---|
| Visual design, screens, tokens, business rules (**source of truth**) | [`/Tok_UIUX_Design_Guide.pdf`](../Tok_UIUX_Design_Guide.pdf) (28 pages, includes multi-tenant, landing, onboarding, plans, super-admin) |
| Older single-restaurant guide (superseded) | [`/Mahob_UIUX_Design_Guide.pdf`](../Mahob_UIUX_Design_Guide.pdf) |
| Code layout & conventions | [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Module specs (this folder) | [`docs/modules/`](./modules/) |
| Payload CMS conventions | [`.claude/skills/payload/SKILL.md`](../.claude/skills/payload/SKILL.md) |

## Tenancy model (decided 2026-11-25)

**Organization with multiple outlets.**

```
Platform (tok-scan)
 └─ Organization        ← the Payload "tenant"; the restaurant business
     └─ Outlet          ← a branch/location; owns tables, orders, invoices
```

Read the full spec in [Module 14](./modules/14-organization-tenant.md) before you build any other module. Every business collection must be scoped to an organization, and most are scoped to an outlet too.

## Modules

| # | Module | Scope | Guide pages | Spec | Status |
|---|---|---|---|---|---|
| 1 | Customer QR Ordering | outlet | S01–S04 | — | not started |
| 2 | Order Tracking | outlet | S05–S06 | — | not started |
| 3 | Billing / Invoice | outlet | S07, p.11 | — | not started |
| 4 | Payments | outlet | S08–S12, p.12 | — | not started |
| 5 | Receipt | outlet | S11 | — | not started |
| 6 | Kitchen Display (KDS) | outlet | p.13 | — | not started |
| 7 | Cashier POS | outlet | p.14 | — | not started |
| 8 | Menu / Catalogue | org (+ outlet overrides) | p.9 | — | not started |
| 9 | Order Management | outlet | p.10 | — | not started |
| 10 | Tables & QR Codes | outlet | p.15 | — | not started |
| 11 | Dashboard & Sales Reports | org / outlet | p.8, p.16 | — | not started |
| 12 | Staff & Permissions | org / outlet | p.17 | — | not started |
| 13 | Settings & Audit | org / outlet | p.18–19 | — | not started |
| **14** | **Organization / Tenant** | platform | p.20, 23–25 | [14-organization-tenant.md](./modules/14-organization-tenant.md) | **spec ready** |
| 15 | Subscription & Plans | platform | p.26 | — | not started |
| 16 | Platform Super-admin | platform | p.27 | — | not started |
| M | Marketing / Landing | public | p.21–22 | `src/modules/marketing/landing` | **built** |

**Build order:** 14 → 12 → 13 → 8 → 10 → 1 → 2 → 6 → 3 → 4 → 5 → 7 → 9 → 11 → 15 → 16
