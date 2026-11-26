# platform — tok-scan super-admin console (Module 16)

**Phase 1 (now): the Payload admin at `/admin` is tok-scan's console.** Phase 2 (later, guide p.27):
a separate console with approvals checklist, "View as tenant", plans & subscriptions, 2FA.

| What                     | Where                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Who can open `/admin`    | super-admins only (`Users.access.admin = superAdminOnly`). Owners and staff use `/dashboard`.                    |
| Console home             | `admin/console-overview.tsx` — counts by status, outlets, tables, "Waiting for approval", "Newest sign-ups"      |
| Logo                     | `admin/graphics.tsx` — tok-scan mark + "Platform console" (shared `LogoMark`)                                    |
| Texts                    | `admin/translations.ts` — Payload admin translations (en · zh), merged by `src/modules/index.ts`                 |
| Approve / suspend        | Organizations → **Status** (super-admin only). `statusChangedAt` / `statusChangedBy` are recorded automatically. |
| Make someone super-admin | `yarn super-admin you@example.com` (the first one), then /admin → Users → Platform role                          |

**Production:** make your account super-admin **before** deploying this, or nobody can open `/admin`:
run `yarn super-admin <email>` with the production `DATABASE_URL`, or in the Neon SQL editor:
`UPDATE users SET platform_role = 'super-admin' WHERE email = '<email>';`
