# Module 14 — Organization / Tenant

|                      |                                                                              |
| -------------------- | ---------------------------------------------------------------------------- |
| **Status**           | Spec ready · not implemented                                                 |
| **Depends on**       | nothing (foundation module)                                                  |
| **Required by**      | every other module                                                           |
| **Design reference** | Not covered by the design guide. New screens must reuse its tokens (see §9). |

---

## 1. Purpose

Turn tok-scan from a single-restaurant app into a platform. Many restaurant businesses (**organizations**) can sign up, each one runs one or more branches (**outlets**), and their data is fully isolated from each other.

### In scope

- `organizations` collection (the Payload tenant)
- `outlets` collection
- Organization membership and roles on `users`
- `invitations` collection
- Tenant scoping rules that every later module must follow
- Active organization and outlet context (switchers)
- Public URL structure for customer pages
- Onboarding flow (sign-up → organization → first outlet)
- Organization branding (logo and colors on customer pages)

### Out of scope

- Plans, limits and billing → Module 15
- Platform console (approve or suspend organizations) → Module 16. This module only adds the `status` field and the super-admin bypass.
- Detailed permission matrix → Module 12. This module only defines role names and where they are stored.
- Tax, currency and payment-provider settings UI → Module 13. This module only stores the default values.

---

## 2. Glossary

| Term               | Meaning                                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Platform**       | tok-scan itself. Platform staff are `super-admin`.                                                                                                                         |
| **Organization**   | The restaurant business, e.g. "Tok-Scans & Bar Co." This is the Payload multi-tenant **tenant**. In code the plugin field is named `tenant` and points to `organizations`. |
| **Outlet**         | A physical location of an organization, e.g. "Mahob — Street 240" or "Mahob — BKK1". Tables, sessions, orders, invoices, payments, KDS and POS belong to an outlet.        |
| **Member**         | A user who belongs to an organization, with an org role and optional per-outlet roles.                                                                                     |
| **Active context** | The organization and outlet the current staff user is working in. They are stored in cookies and changed with the switchers.                                               |

---

## 3. Data model

Use the Postgres adapter (`@payloadcms/db-postgres`). All IDs are numeric.

### 3.1 `organizations` (tenant collection)

| Field        | Type                   | Rules                                                                                                                                                                             |
| ------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | text                   | required, max 80                                                                                                                                                                  |
| `slug`       | text                   | required, unique, `^[a-z0-9](-?[a-z0-9])*$`, 3–40 chars, not in the reserved list (§6.3). Used in URLs. Changing it after the first QR print **requires a redirect** (§8 rule 4). |
| `legalName`  | text                   | optional, shown on receipts                                                                                                                                                       |
| `taxId`      | text                   | optional (VAT TIN), shown on receipts                                                                                                                                             |
| `logo`       | upload → `media`       | optional; square PNG or SVG recommended                                                                                                                                           |
| `brand`      | group                  | `primaryColor` (default `#14513F`), `accentColor` (default `#E09F3E`). Validate hex. Used only on customer-facing pages.                                                          |
| `contact`    | group                  | `email`, `phone`                                                                                                                                                                  |
| `country`    | select                 | default `KH`                                                                                                                                                                      |
| `timezone`   | text                   | default `Asia/Phnom_Penh`                                                                                                                                                         |
| `currency`   | group                  | `primary` (default `USD`), `secondary` (default `KHR`), `exchangeRate` (default `4100`), `khrRounding` (default `100`)                                                            |
| `languages`  | select, hasMany        | `en`, `km`; default both                                                                                                                                                          |
| `defaults`   | group                  | `vatPercent` (10), `vatEnabled` (true), `serviceChargePercent` (5), `serviceChargeEnabled` (true). Outlets inherit these values.                                                  |
| `status`     | select                 | `pending` \| `active` \| `suspended` \| `closed`; default `active` (switch to `pending` once Module 16 adds approval). Only super-admin can change it.                            |
| `onboarding` | group                  | `step` (`organization` \| `outlet` \| `tables` \| `done`), `completedAt` (date)                                                                                                   |
| `owner`      | relationship → `users` | required; set on create to `req.user`                                                                                                                                             |

Admin: `useAsTitle: 'name'`, group "Platform".

### 3.2 `outlets` (tenant-scoped)

The plugin adds the `tenant` field, which points to the organization.

| Field          | Type   | Rules                                                                                                                                             |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`         | text   | required                                                                                                                                          |
| `slug`         | text   | required, unique **within the organization** (compound unique index on `tenant` + `slug`), same regex as the organization slug                    |
| `code`         | text   | required, 2–6 uppercase letters or digits, unique within the organization. Used as a prefix where an ID needs to show which outlet it belongs to. |
| `address`      | group  | `line1`, `line2`, `city`, `province`, `geo` (point, optional)                                                                                     |
| `phone`        | text   | optional                                                                                                                                          |
| `timezone`     | text   | optional; falls back to the organization's timezone                                                                                               |
| `openingHours` | array  | `day` (mon–sun), `open` (HH:mm), `close` (HH:mm), `closed` (checkbox)                                                                             |
| `zones`        | array  | `name` (e.g. Indoor, Terrace, VIP), `sortOrder`. Used by Module 10.                                                                               |
| `overrides`    | group  | `vatPercent`, `vatEnabled`, `serviceChargePercent`, `serviceChargeEnabled`. Empty means inherit from the organization.                            |
| `receipt`      | group  | `headerText`, `footerText` (default footer: "Powered by tok-scan")                                                                                |
| `status`       | select | `active` \| `temporarily_closed` \| `archived`; default `active`                                                                                  |

Hooks:

- `beforeValidate`: lower-case and trim `slug`, upper-case `code`.
- `beforeDelete`: **block hard delete**. Outlets are archived, never deleted (§8 rule 6).

### 3.3 `users` (updated)

| Field          | Type                                  | Rules                                                                                                  |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `email`        | (auth)                                | globally unique. One person can belong to several organizations.                                       |
| `name`         | text                                  | required                                                                                               |
| `avatar`       | upload → `media`                      | optional                                                                                               |
| `tenants`      | array (plugin field, placed manually) | one row per organization membership (see below)                                                        |
| `pinHash`      | text                                  | hidden, set by Module 12                                                                               |

Each row of `tenants` (`tenantsArrayField({ rowFields })`) has these fields:

| Row field     | Type                           | Rules                                                                                                                            |
| ------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `tenant`      | relationship → `organizations` | plugin-provided                                                                                                                  |
| `orgRole`     | select                         | `owner` \| `admin` \| `member`                                                                                                   |
| `outletRoles` | array                          | `outlet` (relationship → `outlets`, filtered to the same organization), `role` (`manager` \| `cashier` \| `kitchen` \| `waiter`) |
| `status`      | select                         | `active` \| `disabled`                                                                                                           |

### 3.4 `invitations` (tenant-scoped)

| Field         | Type                   | Rules                                                                             |
| ------------- | ---------------------- | --------------------------------------------------------------------------------- |
| `email`       | email                  | required, stored lower-case                                                       |
| `orgRole`     | select                 | `admin` \| `member` (`owner` cannot be invited; ownership is transferred instead) |
| `outletRoles` | array                  | same shape as on `users`                                                          |
| `tokenHash`   | text                   | hidden; SHA-256 of the token. Send the raw token **only** in the email link.      |
| `expiresAt`   | date                   | `now + 7 days`                                                                    |
| `status`      | select                 | `pending` \| `accepted` \| `revoked` \| `expired`                                 |
| `invitedBy`   | relationship → `users` | set from `req.user`                                                               |

---

## 4. Roles

The design guide's single "Admin" role is split into **org-level** and **outlet-level** roles.

| Level    | Role          | Can do (summary; the full matrix is in Module 12)                                                                    |
| -------- | ------------- | -------------------------------------------------------------------------------------------------------------------- |
| Platform | `super-admin` | Everything, in every organization (plugin `userHasAccessToAllTenants`) — accounts in the separate `admins` table                                               |
| Org      | `owner`       | Everything in the organization, including deleting it and transferring ownership. At least 1 per organization.       |
| Org      | `admin`       | Everything in every outlet of the organization, plus org settings, outlets and members. This is the guide's "Admin". |
| Org      | `member`      | No org-wide rights; access comes only from `outletRoles`                                                             |
| Outlet   | `manager`     | The guide's "Manager", for this outlet only                                                                          |
| Outlet   | `cashier`     | The guide's "Cashier", for this outlet only                                                                          |
| Outlet   | `kitchen`     | The guide's "Kitchen", for this outlet only                                                                          |
| Outlet   | `waiter`      | The guide's "Waiter", for this outlet only                                                                           |

`owner` and `admin` get manager-level access to **all** outlets automatically. They don't need `outletRoles` rows.

---

## 5. Tenant scoping rules (all modules must follow these)

### 5.1 Scope of each future collection

| Scope            | Collections                                                                                                                                                                           | Fields                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Org-level**    | `outlets`, `invitations`, `categories`, `products`, `product-options`, `customers`, `media`                                                                                           | `tenant` (plugin)                                                       |
| **Outlet-level** | `tables`, `table-sessions`, `orders`, `order-items`, `invoices`, `payments`, `refunds`, `cash-drawers`, `kds-stations`, `outlet-product-overrides` (price or availability per outlet) | `tenant` (plugin) **and** `outlet` (relationship → `outlets`, required) |
| **Platform**     | `users`, `organizations`, `plans` (Module 15)                                                                                                                                         | none                                                                    |
| **Audit**        | `audit-logs`                                                                                                                                                                          | `tenant` and optional `outlet`                                          |

### 5.2 Hard rules

1. **Register** every org-level or outlet-level collection in the plugin's `collections` map. A collection that holds business data but isn't registered is a bug.
2. Every outlet-level collection has a shared `outletField()` with a `beforeValidate` hook that **rejects** an outlet whose `tenant` differs from the document's `tenant`.
3. Outlet-level `read` access = plugin tenant constraint **AND** `outlet IN userOutletIds(user)`, except for org `owner`/`admin` and `super-admin`.
4. Never pass `overrideAccess: true` in request-driven code. The only exceptions are server-side public customer reads (§6.2), which must add an explicit `tenant` + `outlet` `where`.
5. Never hard delete organizations, outlets or financial records. Set `cleanupAfterTenantDelete: false`; closing an organization sets `status: 'closed'`.
6. Running numbers (order and invoice sequences) are counted **per outlet**. The guide's ID formats (`ORD-251125-0152`, `INV-2611-00482`) stay the same, but each outlet has its own sequence.

### 5.3 Access helpers (create in `src/access/`)

```ts
isSuperAdmin(user) // user?.collection === 'admins' — tok-scan staff have their own table
getUserOrgIds(user) // ids from user.tenants where status === 'active'
getOrgRole(user, orgId) // 'owner' | 'admin' | 'member' | null
isOrgAdmin(user, orgId) // owner or admin
getUserOutletIds(user, orgId) // all outlets if org admin, else from outletRoles
getOutletRole(user, outletId) // 'manager' | ... | null (org admin → 'manager')
```

---

## 6. Context, URLs and routing

### 6.1 Active context (staff)

- **Organization:** the plugin's `payload-tenant` cookie, set by the plugin's tenant selector in Payload admin and by our own switcher in the staff app.
- **Outlet:** cookie `tok-outlet` (outlet id). It's validated on every request: if the outlet isn't in `getUserOutletIds`, clear the cookie and fall back to the user's first outlet.
- After login, restore the last used organization and outlet. If the user has exactly 1 organization and 1 outlet, select them automatically with no switcher prompt.

### 6.2 Public customer URLs

```
https://tok-scan.app/r/{orgSlug}                         → organization landing (outlet picker if >1)
https://tok-scan.app/r/{orgSlug}/{outletSlug}            → outlet menu (browse only, no table)
https://tok-scan.app/r/{orgSlug}/{outletSlug}/t/{table}?k={key}   → QR entry (Module 10/1)
```

- Next.js route: `src/app/(frontend)/r/[org]/[outlet]/...`
- Resolve `org` by slug with `status = active`, then resolve the outlet by `tenant` + `slug` with `status != archived`.
- If the organization is `suspended` or `closed`, or the outlet is `temporarily_closed`, show a friendly unavailable page (guide ST3 error style). No ordering is allowed.

### 6.3 Reserved slugs

`admin, api, app, r, t, www, auth, login, logout, signup, onboarding, invite, settings, static, _next, tok-scan, tokscan, support, help, docs, status`

---

## 7. Flows

### 7.1 Sign-up and onboarding (new restaurant)

```
/signup            → name, email, password            → creates user (an owner — tok-scan staff are in `admins`)
/onboarding/org    → org name, slug (auto from name, editable, live availability check), logo, phone
                     → creates organization (owner = user, user.tenants += {orgRole: owner})
/onboarding/outlet → first outlet name, slug, code, address, opening hours
/onboarding/tax    → currency + exchange rate, VAT %, service charge % (prefilled with KH defaults)
/onboarding/done   → "Add your tables" CTA (Module 10) · "Build your menu" CTA (Module 8)
```

- Each step saves when you continue, so closing the browser lets you resume at `organization.onboarding.step`.
- Org and outlet creation happen in **one transaction** per step (pass `req` through for Payload transactions).

### 7.2 Invite a member

1. An org admin opens Members → Invite and enters the email, org role and outlet roles.
2. Create an `invitations` row and email the link `/invite/{token}`.
3. The person opens the link:
     - If logged in with the same email: accept, which adds a `tenants` row.
     - If they have no account: sign up first, with the email locked to the invite.
4. Expired, revoked or wrong-email links show a clear error and a "Ask your admin for a new invite" message.

### 7.3 Switch organization or outlet

- The switcher sits at the top of the staff sidebar and replaces the single restaurant logo from the guide (see §9).
- Switching reloads the data for the current page in the new context and keeps the same route if the user has access there. Otherwise it redirects to the dashboard.

### 7.4 Archive an outlet

- Blocked while the outlet has open table sessions or invoices with a balance > 0 (same rule as guide p.19 #7).
- Archived outlets: their public URLs show "This location is closed", they're hidden from switchers, and their reports stay readable.

---

## 8. Business rules

| #   | Rule                                                                                                   | UI behaviour                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| 1   | Every organization has ≥ 1 active `owner`.                                                             | Removing or demoting the last owner is disabled, with the reason shown.                                             |
| 2   | An organization slug is globally unique; an outlet slug is unique within its organization.             | Live availability check with a green or red hint.                                                                   |
| 3   | Data never crosses organizations.                                                                      | Enforced by the plugin and the §5 rules; covered by integration tests.                                              |
| 4   | Changing a slug after QR codes exist keeps the old slug as a redirect.                                 | Warning: "Printed QR codes will keep working through a redirect." Store old slugs in `organizations.previousSlugs`. |
| 5   | A suspended organization: staff get read-only access, customers can't order.                           | Banner across the staff app; unavailable page on public routes.                                                     |
| 6   | Outlets and organizations are archived or closed, never deleted.                                       | The Delete action is replaced with Archive.                                                                         |
| 7   | Outlet tax settings inherit from the organization unless overridden.                                   | Overridden fields show an "Overridden" chip and a "Reset to org default" link.                                      |
| 8   | An invitation expires after 7 days and can be used once.                                               | Status chip: Pending / Accepted / Expired / Revoked.                                                                |
| 9   | Customer pages show the **restaurant's** brand; staff and platform chrome show the **tok-scan** brand. | Footer "Powered by tok-scan" on all customer pages.                                                                 |
| 10  | Membership changes, role changes, slug changes and status changes are audited.                         | Written to `audit-logs` (Module 13) with who, what and when.                                                        |

---

## 9. UI / screens (match the design guide's tokens)

Use the guide's tokens: Jasmine Green `#14513F`, Saffron `#E09F3E`, Rice Paper `#FAF8F4`, Inter, card radius 14, button radius 12, the 4-pt spacing grid and the motion timings from p.20.

| Screen                                     | Device                    | Notes                                                                                                                                                                                                     |
| ------------------------------------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sign-up / Login                            | mobile + desktop          | tok-scan logo, Rice Paper background, one primary button                                                                                                                                                  |
| Onboarding wizard (4 steps)                | desktop-first, responsive | Progress steps styled like the guide's order lifecycle (p.19); bottom-anchored primary action on mobile                                                                                                   |
| Org + outlet switcher                      | desktop sidebar           | Replaces the guide's sidebar logo block: org logo, org name, outlet name, and a chevron that opens a popover listing organizations, then outlets, plus "+ New outlet". Collapses to a logo below 1280 px. |
| Organization settings → Profile & Branding | desktop                   | Logo upload (same pattern as the guide p.9 "Replace photo"), two color pickers with a **live preview** of the customer welcome screen (S01)                                                               |
| Organization settings → Outlets            | desktop                   | List with status chips and a side drawer to edit (guide p.9 pattern)                                                                                                                                      |
| Organization settings → Members            | desktop                   | Table like guide p.17: name, org role, outlet roles, status, last active, plus an Invite button. Invite opens a side drawer.                                                                              |
| Accept invite                              | mobile + desktop          | Card: "{Inviter} invited you to {Org}", role summary, Accept button                                                                                                                                       |
| Unavailable page (public)                  | mobile                    | Guide ST3 style: icon, one-line reason, no actions except "Call restaurant" when a phone number is set                                                                                                    |

Status chip colors reuse the guide's semantic palette:

- `active` = success
- `pending` = warning
- `suspended` = error
- `closed` and `archived` = neutral
- `temporarily_closed` = warning

---

## 10. Implementation tasks (for agents)

Do them in order. Run `yarn generate:types` after any schema change.

1. **Install the plugin** at the same version as `payload`:
   `yarn add @payloadcms/plugin-multi-tenant@3.94.2`
2. **Access helpers:** `src/access/` (§5.3). Add unit tests in `tests/int/access.int.spec.ts`.
3. **Collections:**
     - `src/collections/Organizations.ts`
     - `src/collections/Outlets.ts`
     - `src/collections/Invitations.ts`
     - Update `src/collections/Users.ts` (`platformRole`, plus `tenantsArrayField({ rowFields })` placed manually)
     - Shared field `src/fields/outletField.ts` (§5.2 rule 2)
4. **Plugin config** in `src/payload.config.ts`:
     ```ts
     multiTenantPlugin<Config>({
          tenantsSlug: 'organizations',
          cleanupAfterTenantDelete: false,
          tenantsArrayField: { includeDefaultField: false },
          userHasAccessToAllTenants: (user) => isSuperAdmin(user),
          collections: {
               outlets: {},
               invitations: {},
               media: {},
               // later modules add their collections here
          },
     })
     ```
     Confirm the option names against the installed plugin's types before relying on them, and update this spec if any differ.
5. **Users access:** a user can read themselves and members of organizations where they are an org admin. Only super-admin (an `admins` account) can read all users or change memberships.
6. **Database:** Postgres runs in push mode in dev. Before the first deploy, create a migration: `yarn payload migrate:create org_tenant`.
7. **Seed** (`src/seed/orgs.ts`, run in dev only):
     - 1 super-admin
     - org "Tok-Scans & Bar" with 2 outlets ("Street 240", "BKK1"), as sample tenant data
     - 1 owner, 1 manager per outlet, 1 cashier, 1 kitchen user
     - a second org "Demo Café" with 1 outlet, used for isolation tests
8. **Frontend routes:**
     - `src/app/(frontend)/r/[org]/[outlet]/page.tsx` (resolution and unavailable states only; the menu comes in Module 1)
     - `/signup`
     - `/onboarding/*`
     - `/invite/[token]`
9. **Switcher component** (shadcn `Popover` + `Command`) and the `tok-outlet` cookie handling.
10. **Tests:** see §11.

---

## 11. Acceptance criteria

- [ ] A cashier of Mahob/Street 240 **cannot** read, via REST, GraphQL or the Local API with `overrideAccess: false`, any outlet, invitation or user of "Demo Café", **or** any outlet-level record of Mahob/BKK1.
- [ ] A Mahob org admin can read all Mahob outlets and none of Demo Café's.
- [ ] A super-admin can read everything.
- [ ] Creating an outlet-level record with `outlet` from another organization fails validation.
- [ ] Removing the last owner fails with a clear error.
- [ ] An organization slug that is reserved, duplicate or badly formatted is rejected. A duplicate outlet slug in the same organization is rejected, but the same slug in a different organization is allowed.
- [ ] Hard delete of an organization or outlet is blocked.
- [ ] `/r/mahob/street-240` resolves; `/r/mahob/unknown` returns 404; a suspended organization shows the unavailable page.
- [ ] Onboarding can be resumed after closing the tab at any step.
- [ ] An invite link works once, expires after 7 days, and rejects a different logged-in email.
- [ ] `yarn lint`, `yarn test:int` and `yarn build` pass.

---

## 12. Open questions

1. **Custom domains** (e.g. `menu.mahob.com`): defer to Module 15/16? The plugin example supports domain-based tenant selection via an `afterLogin` hook.
2. **Staff app location:** should the staff screens from the guide (dashboard, KDS, POS) be built as a **custom Next.js staff app** (`/app/...`, styled with the guide) and Payload admin kept for super-admin and content only? Recommended: yes. It needs a decision before Module 6/7.
3. **Self sign-up vs approval:** new organizations start as `active` for now; switch to `pending` with approval once Module 16 exists?
4. **Per-outlet menus:** is the org-wide menu with per-outlet price and availability overrides enough, or do outlets need fully separate menus?

---

## 13. Changes from Tok_UIUX_Design_Guide v1.0 (p.20–27). These override the sections above where they differ.

1. **Organization status:** a new organization starts as **`trial`** (14 days). The status values become `trial | pending_approval | active | overdue | suspended | closed`. Before approval, the restaurant can build everything and take **cash** orders. Online payments (KHQR, ABA) switch on only after tok-scan approves it (p.22 step 8, p.27).
2. **URLs (p.20):**
     - Customer QR: `tok-scan.app/r/{orgSlug}/t/{table}?k={key}`. The outlet is resolved from the table key, so the outlet slug isn't in the QR link. `/r/{orgSlug}/{outletSlug}` remains the browse-only menu.
     - Staff app: `app.tok-scan.app/{orgSlug}/{outletSlug}/…` (for example `/mahob/bkk1/orders` or `/mahob/bkk1/kitchen`).
     - Super-admin console: `console.tok-scan.app` (2FA).
     - Custom domain (Premium and Chain plans): for example `menu.mahob.com.kh`.
3. **Numbering (p.20):** numbers are unique per organization and include an org code, for example `INV-MHB-2611-00482` and `ORD-MHB-251125-0152`. Add `organizations.code`: 2–4 uppercase letters, unique, generated from the name.
4. **Onboarding (p.23):** there are 4 screens: `/signup` (Google or email, phone/Telegram, password ≥ 10 characters, accept terms), then `/onboarding/organization` (business name, slug with a live availability check, logo, brand colour with a contrast check, business type: Restaurant / Café / Bar / Food court), then `/onboarding/outlet` (name, address, currency and rate, VAT, service charge, lighting tax, VAT TIN, opening hours), then `/onboarding/tables` (zone, table count, QR preview, download all QR codes as A6 stands). A 6-digit verification code by email or Telegram comes between sign-up and the organization step (p.22 step 3).
5. **Dashboard setup checklist (p.22):** the dashboard shows "Get {org} live" with 6 steps (organization, first outlet, tables and QR, add menu items or import CSV, connect KHQR/ABA, invite staff) until all are done.
6. **Branding (p.25):** a restaurant can set its logo, cover photo, name, primary colour (auto contrast check, falls back to tok-scan green), heading font (4 curated choices), menu languages (English, Khmer, Chinese) and receipt texts. The layout, payment screens and status colours always stay tok-scan's. The "Powered by tok-scan" footer can be removed on Premium and Chain plans.
7. **Tenant states on customer pages (p.25):** an expired QR key shows "This QR code has expired" with a "Call a waiter" button. A suspended organization shows "Online menu temporarily unavailable". A closed outlet shows its opening hours. An unknown slug shows the tok-scan 404 page.
8. **Members (p.24):** staff on kitchen and cashier devices can also sign in with a 4-digit PIN. The member list shows seats used against the plan limit.
