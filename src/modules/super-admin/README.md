# super-admin — tok-scan super-admin console (Module 16)

**Phase 1 (now): the Payload admin at `/admin` is tok-scan's console.** Phase 2 (later, guide p.27):
a separate console with approvals checklist, "View as tenant", plans & subscriptions, 2FA.

| What                     | Where                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Who can open `/admin`    | super-admins only (`Users.access.admin = superAdminOnly`). Owners and staff use `/dashboard`.                      |
| Look (global, reusable)  | `src/shared/components/super-admin/` — logo, theme colours, login panel + grid, heading, Turnstile, ConsoleView    |
| Console home (data)      | `admin/console-overview.tsx` — counts by status, outlets, tables, "Waiting for approval", "Newest sign-ups"        |
| Login page (texts)       | `admin/login.tsx` — picks the texts for the shared login components                                                |
| Texts                    | `admin/translations.ts` — Payload admin translations (en · zh), merged by `src/modules/index.ts`                   |
| Registration             | `payload.ts` — which component goes in which Payload admin slot                                                    |
| Bot check                | `/admin/login` and `/api/users/login` need Turnstile (users `beforeOperation` hook, token in `tok-captcha` cookie) |
| Approve / suspend        | Organizations → **Status** (super-admin only). `statusChangedAt` / `statusChangedBy` are recorded automatically.   |
| Make someone super-admin | `yarn super-admin you@example.com` (the first one), then /admin → Users → Platform role                            |
| Local login              | `yarn seed:admin` — creates `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env` (local database only)           |

**Production:** make your account super-admin **before** deploying this, or nobody can open `/admin`:
run `yarn super-admin <email>` with the production `DATABASE_URL`, or in the Neon SQL editor:
`UPDATE users SET platform_role = 'super-admin' WHERE email = '<email>';`
