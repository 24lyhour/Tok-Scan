# super-admin — tok-scan super-admin console (Module 16)

**`/console` is tok-scan's console (guide p.27)** — charcoal sidebar, KPI cards, status tabs, table,
detail panel with Approve / Suspend. **`/admin` (Payload) is the raw data admin** for editing any
record; its home links to the console. Later: Overview, audit log, plans & subscriptions, support,
"View as tenant", 2FA (shown as "Soon").

| What                      | Where                                                                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Who can open them         | super-admins only — `/console` checks `getConsoleContext()`, `/admin` checks `Users.access.admin`                                                           |
| Console pages             | `console/organizations/` — Organizations + Approvals (same view, Approvals = pending only), URL holds the filters                                           |
| Approve / suspend         | `console/organizations/actions.ts` — allowed changes in `query.ts` (`STATUS_ACTIONS`); who/when recorded by hook                                            |
| Menu                      | `console/shell/nav.ts` — items without `href` show "Soon"                                                                                                   |
| Texts                     | `console/content/` (en · km · zh, `console` namespace) · `admin/translations.ts` (Payload admin, en · zh)                                                   |
| Look (global, reusable)   | `src/shared/components/shell/` (sidebar, top bar, layout — shared with the restaurant app) · `src/shared/components/super-admin/` (Payload admin look)      |
| Payload admin wiring      | `payload.ts` — which component goes in which Payload slot (`admin/login.tsx`, `admin/console-link.tsx`)                                                     |
| Bot check                 | `/admin/login` checks Turnstile itself; `/api/users/login` and `/api/admins/login` need a token too (core `requireCaptchaOnApiLogin`, `tok-captcha` cookie) |
| Staff accounts            | Their own table, **`admins`** (`collections/admins.ts`) — separate from restaurant owners (`users`). Log in at `/admin/login`. Add more in /admin → Admins  |
| First / local staff login | `yarn seed:admin` — creates the staff account `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env` (local database; `--remote` for another)               |

**Production:** the migration `20261127_101613_separate_admins_table` copies existing staff into
`admins` (users with the old `platform_role = super-admin`, and every email in `SUPER_ADMIN_EMAILS`)
with their password. After that, `SUPER_ADMIN_EMAILS` is no longer used and can be removed.
