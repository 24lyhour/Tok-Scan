# tables — Module 10: Tables & QR codes

Design: guide p.15 · Each table has its own QR code: `https://<domain>/r/<orgSlug>/t/<label>?k=<qrKey>`.

| Folder / file | What |
|---|---|
| `collections/tables/` | `tables` — label (T01…), number, zone, seats, secret `qrKey`. Tenant- and outlet-scoped. |
| `qr.ts` | `tableLabel`, `newQrKey`, `buildTableQrUrl`, `qrSvg` (one QR look everywhere) |
| `components/qr-code.tsx` | `QrCode` — QR drawn in the browser |

Who can do what: members read; owner/admin create, change and delete (`@/modules/core`).
Changing `qrKey` invalidates printed codes. The guest page `/r/<slug>/t/<label>` comes with Module 1 (menu).

Entry points: `index.ts` (QR helpers, `QrCode`, constants) · `payload.ts` (collection, registry only).
