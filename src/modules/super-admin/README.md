# super-admin — tok-scan super-admin console (Module 16)

**`/console` is tok-scan's console (guide p.27)** — charcoal sidebar, KPI cards, status tabs, table,
detail panel with Approve / Suspend. **`/admin` (Payload) is the raw data admin** for editing any
record; its home links to the console. Later: Overview, audit log, plans & subscriptions, support,
"View as tenant", 2FA (shown as "Soon").

| What                     | Where                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Who can open them        | super-admins only — `/console` checks `getConsoleContext()`, `/admin` checks `Users.access.admin`                                                      |
| Console pages            | `console/organizations/` — Organizations + Approvals (same view, Approvals = pending only), URL holds the filters                                      |
| Approve / suspend        | `console/organizations/actions.ts` — allowed changes in `query.ts` (`STATUS_ACTIONS`); who/when recorded by hook                                       |
| Menu                     | `console/shell/nav.ts` — items without `href` show "Soon"                                                                                              |
| Texts                    | `console/content/` (en · km · zh, `console` namespace) · `admin/translations.ts` (Payload admin, en · zh)                                              |
| Look (global, reusable)  | `src/shared/components/shell/` (sidebar, top bar, layout — shared with the restaurant app) · `src/shared/components/super-admin/` (Payload admin look) |
| Payload admin wiring     | `payload.ts` — which component goes in which Payload slot (`admin/login.tsx`, `admin/console-link.tsx`)                                                |
| Bot check                | `/admin/login` and `/api/users/login` need Turnstile (users `beforeOperation` hook, token in `tok-captcha` cookie)                                     |
| Make someone super-admin | `yarn super-admin you@example.com` (the first one), then /admin → Users → Platform role                                                                |
| Local login              | `yarn seed:admin` — creates `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env` (local database only)                                               |

**Production:** make your account super-admin **before** deploying this, or nobody can open `/admin`:
run `yarn super-admin <email>` with the production `DATABASE_URL`, or in the Neon SQL editor:
`UPDATE users SET platform_role = 'super-admin' WHERE email = '<email>';`
