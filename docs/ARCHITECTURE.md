# tok-scan — Code Architecture

Code is organized as **feature modules**. Each product module (see [README](./README.md)) is a folder in `src/modules/`, and each feature inside it is a **sub-module** folder.

```
src/
├─ app/                          # Next.js routes only — thin files that import from modules
│  ├─ (frontend)/                # public site, onboarding, customer QR pages, staff app
│  └─ (payload)/                 # Payload admin + REST/GraphQL (generated, don't edit by hand)
├─ modules/
│  ├─ index.ts                   # registry: imports every module's payload.ts → payload.config.ts
│  ├─ core/                      # platform-wide: access.ts (roles) · plans.ts (limits) · media
│  │  ├─ access.ts               # WHO CAN DO WHAT — role rules used by every collection
│  │  ├─ collections/media/      # Media (tenant-scoped) + Vercel Blob storage
│  │  └─ i18n/
│  ├─ tenancy/                   # Module 14 — Organization / Tenant
│  │  ├─ collections/            # users · organizations · outlets
│  │  ├─ auth/                   # login/ (page·form·schema·actions) · google/ · server/
│  │  ├─ onboarding/             # signup/ organization/ outlet/ tables/ go-live/
│  │  ├─ shared/                 # auth shell + social sign-in (auth and onboarding)
│  │  └─ plugin.ts               # multi-tenant plugin
│  ├─ tables/                    # Module 10 — collections/tables · qr.ts · components/qr-code
│  ├─ workspace/                 # signed-in app: AppShell (sidebar, switcher, top bar) + dashboard
│  ├─ assistant/                 # TOKSCAN chat — reusable (landing: visitor · app: owner)
│  ├─ super-admin/               # super-admin console: texts, data, Payload wiring (UI in shared) — Module 16
│  └─ marketing/landing/         # public landing page (guide p.21–22)
├─ shared/                       # used by 2+ modules, NO business rules, never imports modules
│  ├─ components/ui/             # shadcn + StatCard · Legend · Note (reusable building blocks)
│  ├─ components/form/           # Field, inputs, Toggle, Stepper, ChoiceChips, useActionForm
│  ├─ components/shell/          # app frame for both apps: ShellSidebar (green | charcoal) · ShellTopbar · ShellLayout
│  ├─ components/super-admin/    # super-admin only: logo, theme, login panel, Turnstile, console banner
│  ├─ components/{brand,i18n,illustrations,motion,security}/
│  ├─ lib/                       # utils (cn) · validation (Zod helpers) · payload (exists, relationId…)
│  └─ i18n/ · config/ · security/
└─ payload.config.ts
tests/
├─ int/                          # Vitest + real Payload/Postgres (access rules)
├─ e2e/                          # Playwright (onboarding flow)
└─ helpers/
```

## Module layout

**Data and screens are separated, and every module has two entry points** (plus an optional third, `rules.ts`).

```
src/modules/<module>/
├─ README.md                   # what it does · routes · who can do what
├─ payload.ts                  # BACKEND entry: collections, tenant-scoped slugs, plugins
│                              #   → imported ONLY by src/modules/index.ts
├─ index.ts                    # PUBLIC API: pages, components, helpers, constants
│                              #   → what src/app and other modules import
├─ rules.ts                    # optional BROWSER-SAFE entry: Zod rules + constants only
│                              #   → for client forms in OTHER modules (index.ts may pull in server code)
├─ collections/
│  ├─ index.ts                 # <module>Collections + <module>TenantScoped
│  └─ <name>/
│     ├─ collection.ts         # Payload config only — access rules come from @/modules/core
│     ├─ constants.ts          # options, defaults, limits — also used by forms
│     └─ hooks/                # one hook per file, when needed
├─ <feature>/                  # one screen or flow, e.g. onboarding/organization/
│  ├─ page.tsx                 # server: guard + load data + render
│  ├─ form.tsx                 # 'use client': UI state only (useActionForm)
│  ├─ schema.ts                # Zod — the SAME check runs in the browser and the action
│  ├─ actions.ts               # 'use server': user → validate → write → log → redirect
│  └─ schema.test.ts           # unit tests next to the code
├─ server/                     # server-only helpers — first line `import 'server-only'`
└─ routes.ts · errors.ts       # URLs · error codes + validator
```

### Access rules (`src/modules/core/access.ts`)

Every collection uses these — never an inline `({ req }) => …`.

| Collection | read | create | update / delete |
|---|---|---|---|
| organizations | members (`orgMembersRead`) | server only | owner/admin (`orgManagersUpdate`), never deleted |
| outlets, tables, media | members (`tenantMembers`), media public | owner/admin + `requireTenantManager` hook | owner/admin (`tenantManagers`) |
| users | yourself + colleagues (`usersRead`) | server only | yourself (`selfOrSuperAdmin`); roles only by super-admin |

Roles live in `users.tenants[].orgRole`: `owner` · `admin` · `member`. tok-scan staff are a separate table, `admins` (super-admin module): `isSuperAdmin(user)` = signed in from `admins`.
Server actions write with `overrideAccess: true` **after** checking the user themselves (e.g. `getOnboardingContext`).

### Forms

- Validation is **Zod** (`src/shared/lib/validation.ts`). Schema messages are error **codes**
  (`'required'`, `'slugTaken'`), translated in `src/i18n/<lang>/<namespace>.ts` → `errors`.
- Every form uses `useActionForm` from `@/shared/components/form`: `<form {...form.formProps}>`,
  `<Field required>` shows the red `*`, `<SubmitButton disabled={!form.ready}>` stays disabled until
  every required field has a value.
- Defaults and limits come from the collection's `constants.ts` — never typed twice.

## Rules

0. **Entry points.** Other modules import `@/modules/<module>` (public: pages, components, helpers), `@/modules/<module>/payload` (backend: collections, access rules) or `@/modules/<module>/rules` (browser-safe: validation rules and constants for a client form — `index.ts` can pull server-only code into the browser). *Enforced by ESLint.*
1. **Routes are thin.** A file in `src/app/` only imports from a module entry point, e.g. `@/modules/tenancy`.
2. **Import modules through their entry point** (`@/modules/<module>`), relative paths inside a module. *Enforced by ESLint.*
3. **`src/shared/` never imports `src/modules/`.** *Enforced by ESLint.*
4. **Register backend pieces in one place:** each module's `payload.ts` → `src/modules/index.ts` → `payload.config.ts`.
5. **Server code stays on the server:** files in `server/` start with `import 'server-only'` (the build fails if a client file imports them).
6. **Access rules only from `core/access.ts`**, and every change to them gets a test in `tests/int/access.int.spec.ts`.
7. **Every collection change ships with a migration:** `yarn payload migrate:create <name>`. *Checked in CI.*
8. **Shared means used twice.** Move code to `src/shared/` only when a second module needs it.
9. **Tenant scoping.** Every business collection follows [Module 14 §5](./modules/14-organization-tenant.md).
10. **Design tokens.** Use the Tailwind tokens in `src/app/(frontend)/styles.css` (`brand-*`, `saffron-*`, `ink`, `line`, `paper`, `success`, `error` …). No hex values in components except brand data. Never white text on saffron.
11. **Formatting.** Prettier, **5-space indentation**. Generated files are in `.prettierignore`.
12. **Package manager.** Yarn only. Never npm or pnpm.

## Quality checks

| Command | What | When |
|---|---|---|
| `yarn typecheck` | TypeScript | CI + before commit |
| `yarn lint` | ESLint incl. module boundaries | CI + before commit |
| `yarn test:unit` | Vitest, `src/**/*.test.ts`, no database | CI + while coding |
| `yarn test:int` | Vitest + Payload + Postgres (`tests/int`) | CI |
| `yarn test:e2e` | Playwright (`tests/e2e`), starts `yarn dev` if needed | CI |

CI (`.github/workflows/ci.yml`) runs all of these on every pull request with a fresh Postgres,
applies every migration, and fails if a collection changed without a migration.

### App pages (signed-in)

Every app page lives in the route group `src/app/(frontend)/(app)/`, whose `layout.tsx` is
`AppShell` (`@/modules/workspace`): sidebar, organization/outlet switcher, top bar, TOKSCAN.
A page renders only its content. To add one (e.g. Menu):

1. Add the URL to `src/shared/config/app-routes.ts`.
2. Give its menu item an `href` in `src/modules/workspace/shell/nav.ts` — the sidebar link and the
   top-bar title ("Catalogue · Menu Management") come from there.
3. Create `src/app/(frontend)/(app)/<page>/page.tsx` that renders the module's page.

### Adding a module (e.g. Menu)

1. Copy the module layout above; write `README.md` (routes + who can do what).
2. `collections/<name>/collection.ts` + `constants.ts`, access from `@/modules/core`; list it in `collections/index.ts`.
3. `payload.ts` → add it to `src/modules/index.ts`.
4. Texts: `src/i18n/en/<name>.ts` + `km/` + `zh/`, exported from each folder's `index.ts`.
5. Each screen: `schema.ts` (+ test) → `actions.ts` → `form.tsx` → `page.tsx` → thin route in `src/app/`.
6. `yarn payload migrate:create <name>` · `yarn generate:types` · access test in `tests/int` · e2e for the main flow.

## Translations (i18n)

Languages: **English (`en`) · Khmer (`km`) · Chinese (`zh`)**. The visitor's choice is kept in the `tok-locale` cookie.

```
src/shared/i18n/
  locales.ts      ← THE language list (codes, labels, Intl tags, <html lang>). Add a language here only.
  format.ts       ← interpolate · plural · formatNumber · formatMoney · localizeDigits
  get-locale.ts   ← server: read the cookie
src/i18n/         ← every text of the site + the engine
  messages.ts     ← registry (getNamespace / getMessages) + text types (ConsoleContent …)
  en/             ← English — the source of truth: common.ts · landing.ts · auth.ts · onboarding.ts ·
                    workspace.ts · console.ts · assistant.ts · consent.ts · index.ts
  km/ · zh/       ← the same files, each typed against en (`export const console: ConsoleContent`)
  server.ts       ← getTranslations()
  client.tsx      ← useTranslations(), useLocale()
  provider.tsx    ← <TranslationsProvider namespaces={[…]}>
src/modules/core/i18n/                        ← Payload: content `localization` + admin UI `i18n`
```

### Rules

1. **All text lives in `src/i18n/`, one folder per language** (`en/`, `km/`, `zh/`), one file per namespace. `en/` is the source of truth; `km/` and `zh/` are typed against it, so a missing key, namespace or language is a compile error. A translator works in one folder.
2. **Copy and data are separate.** Links, prices, ids and counts live in the module (e.g. `marketing/landing/data.ts`). Language files hold text only; when their keys come from module ids, they `import type` those ids from the module's entry point.
6. **Words used in many places** (Save, Soon, Log out …) live once in `common`.
3. **Key items by id, never by position.** Use `steps: { scan: {…}, cook: {…} }`, not an array matched to icons by index. Plain lists with no paired data (FAQ items, bullet points) can stay arrays.
4. **Add a namespace** by creating `<name>.ts` in `en/`, `km/` and `zh/` and exporting it from each `index.ts`. Components that take text as props use the types from `@/i18n/messages`.
5. **Reading text**
   - Server: `const { m, t, locale } = await getTranslations('ns')`
   - Client: `const { m, t, locale } = useTranslations('ns')`
   - Use `m.section.key` to read copy, and `t('section.key', { name })` when you need `{placeholders}`.
   - **`t` is always the function.** Name text objects `m`, or `copy` for one screen's slice. Never write `const { m: t }`.
6. **Send only what a page needs to the browser.** The root layout loads `common`. A page wraps itself in `<TranslationsProvider namespaces={['auth']}>` when its client components need that namespace. Server components don't need a provider.
7. **Use the helpers for numbers and money:** `formatMoney(19)` → `$19`, `formatMoney(26700, 'KHR')` → `KHR 26,700`, `plural(locale, n, { one, other })`, and `localizeDigits` for counts (Khmer numerals). Don't build `$` strings by hand.
8. **Page titles and descriptions** come from `generateMetadata` plus `getTranslations`. Never hard-code English metadata.
9. **No hard-coded UI text in components.** That includes illustrations and `aria-label`s. Brand names like tok-scan stay as they are.
