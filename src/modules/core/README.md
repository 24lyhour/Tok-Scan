# core — platform building blocks

Used by every other module. No screens.

| Folder / file | What |
|---|---|
| `access.ts` | **Who can do what.** Role rules (`tenantMembers`, `tenantManagers`, `orgManagersUpdate`, `selfOrSuperAdmin` …) and the `requireTenantManager` hook. Every collection imports its access from here. |
| `collections/media/` | `media` — uploaded images (logos, dish photos). Tenant-scoped, publicly readable, changed only by that organization's owner/admins. Stored in Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set. |
| `i18n/` | Payload content languages (en · km · zh) and admin UI languages. |

Entry points: `index.ts` (access rules) · `payload.ts` (collections, storage, i18n — registry only).
Tests: `access.test.ts` (unit) · `tests/int/access.int.spec.ts` (real database).
