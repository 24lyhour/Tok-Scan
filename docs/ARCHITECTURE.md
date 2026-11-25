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
