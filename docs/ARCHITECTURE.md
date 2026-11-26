# tok-scan — Code Architecture

Code is organized as **feature modules**. Each product module (see [README](./README.md)) is a folder in `src/modules/`, and each feature inside it is a **sub-module** folder.

```
src/
├─ app/                          # Next.js routes only — thin files that import from modules
│  ├─ (frontend)/                # public site, onboarding, customer QR pages, staff app
│  └─ (payload)/                 # Payload admin + REST/GraphQL (generated, don't edit by hand)
├─ modules/
│  ├─ index.ts                   # registry: the ONLY backend import used by payload.config.ts
│  ├─ core/                      # platform-wide building blocks
│  │  └─ media/collection.ts
│  ├─ tenancy/                   # Module 14 — Organization / Tenant
│  │  ├─ index.ts                # exports tenancyCollections
│  │  ├─ users/collection.ts
│  │  ├─ organizations/          # (next)
│  │  ├─ outlets/                # (next)
│  │  ├─ invitations/            # (next)
│  │  └─ onboarding/             # (next) /signup → /onboarding/*
│  └─ marketing/
│     └─ landing/                # public landing page (guide p.21–22)
│        ├─ index.ts             # public API of the sub-module
│        ├─ content.ts           # all copy, prices, links
│        ├─ landing-page.tsx
│        └─ components/
├─ shared/                       # used by 2+ modules
│  ├─ components/ui/             # shadcn components (components.json points here)
│  ├─ components/brand/logo.tsx  # tok-scan logo
│  └─ lib/utils.ts               # cn()
└─ payload.config.ts
```

## Sub-module layout

Only create the files a feature needs:

```
src/modules/<module>/<submodule>/
├─ index.ts          # public API — other code imports only from here
├─ collection.ts     # Payload CollectionConfig
├─ access.ts         # access-control functions
├─ hooks/            # Payload hooks (one file per hook)
├─ fields/           # reusable field configs
├─ actions.ts        # Next.js server actions
├─ components/       # React UI for this feature
├─ content.ts        # user-facing copy (keeps i18n easy)
└─ *.test.ts         # tests next to the code
```

## Rules

1. **Routes are thin.** A route file in `src/app/` only imports and renders something from a module, for example `app/(frontend)/page.tsx` → `@/modules/marketing/landing`.
2. **Import through `index.ts`.** Code outside a module must not reach into another module's internals.
3. **Register backend pieces in one place.** A module's `index.ts` exports `<module>Collections`, which is added in `src/modules/index.ts`. `payload.config.ts` never imports collections directly.
4. **Shared means used twice.** Move code to `src/shared/` only when a second module needs it.
5. **Tenant scoping.** Every business collection follows [Module 14 §5](./modules/14-organization-tenant.md).
6. **Design tokens.** Use the Tailwind tokens defined in `src/app/(frontend)/styles.css`: `brand-*`, `saffron-*`, `ink`, `ink-2`, `ink-3`, `line`, `paper`, `success`, `warning`, `error`, `info`, `progress`, `khqr`. Don't hard-code hex values in components. Never put white text on saffron.
7. **Formatting.** Prettier with **5-space indentation** (`tabWidth: 5`). Run `npx prettier --write <files>` on what you change.
8. **Package manager.** Use Yarn only (`yarn add`). Never use npm in this repo.

## Translations (i18n)

Languages: **English (`en`) · Khmer (`km`) · Chinese (`zh`)**. The visitor's choice is kept in the `tok-locale` cookie.

```
src/shared/i18n/
  locales.ts      ← THE language list (codes, labels, Intl tags, <html lang>). Add a language here only.
  format.ts       ← interpolate · plural · formatNumber · formatMoney · localizeDigits
  get-locale.ts   ← server: read the cookie
src/i18n/         ← app-level catalog — the only place that knows every namespace
  messages.ts     ← registry: add a namespace in ONE place
  common/         ← `common` namespace (site meta, skip link, buttons, states) — loaded on every page
  server.ts       ← getTranslations()
  client.tsx      ← useTranslations(), useLocale()
  provider.tsx    ← <TranslationsProvider namespaces={[…]}>
src/modules/<module>/<submodule>/content/     ← that feature's text, one file per language
  index.ts        ← assembles { en, km, zh } as Translations<…> (+ re-exports data and types)
  en.ts           ← English — the source of truth (`type XContent = typeof en`)
  km.ts · zh.ts   ← `export const km: XContent = { … }` — must match en exactly
  data.ts         ← optional: links, prices, ids, numbers (never translated)
  types.ts        ← optional: an explicit content type when keys come from data ids
src/modules/core/i18n/                        ← Payload: content `localization` + admin UI `i18n`
```

### Rules

1. **Text lives next to its feature** in a `content/` folder with **one file per language** (`en.ts`, `km.ts`, `zh.ts`). `en.ts` is the source of truth; `km.ts` and `zh.ts` are typed against it, so a missing key or language is a compile error. A translator edits one file, and git diffs show exactly which language changed. Don't create global per-language files (`src/i18n/km.ts` with every feature).
2. **Copy and data are separate.** Links, prices, ids and counts live in `content/data.ts` (or the feature's code). Language files hold text only.
3. **Key items by id, never by position.** Use `steps: { scan: {…}, cook: {…} }`, not an array matched to icons by index. Plain lists with no paired data (FAQ items, bullet points) can stay arrays.
4. **Register a new namespace once** in `src/i18n/messages.ts` (`catalog`). Import the module's `content` folder directly, not the module's `index.ts`.
5. **Reading text**
   - Server: `const { m, t, locale } = await getTranslations('ns')`
   - Client: `const { m, t, locale } = useTranslations('ns')`
   - Use `m.section.key` to read copy, and `t('section.key', { name })` when you need `{placeholders}`.
   - **`t` is always the function.** Name text objects `m`, or `copy` for one screen's slice. Never write `const { m: t }`.
6. **Send only what a page needs to the browser.** The root layout loads `common`. A page wraps itself in `<TranslationsProvider namespaces={['auth']}>` when its client components need that namespace. Server components don't need a provider.
7. **Use the helpers for numbers and money:** `formatMoney(19)` → `$19`, `formatMoney(26700, 'KHR')` → `KHR 26,700`, `plural(locale, n, { one, other })`, and `localizeDigits` for counts (Khmer numerals). Don't build `$` strings by hand.
8. **Page titles and descriptions** come from `generateMetadata` plus `getTranslations`. Never hard-code English metadata.
9. **No hard-coded UI text in components.** That includes illustrations and `aria-label`s. Brand names like tok-scan stay as they are.
