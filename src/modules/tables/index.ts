/**
 * Module 10 — Tables & QR codes (guide p.15). Tenant- and outlet-scoped.
 *
 *   collections/   data: tables              (backend entry: payload.ts)
 *   qr.ts          QR links + SVG drawing
 *   components/    QrCode
 *
 * Public API — safe to import from pages, server actions and client components.
 */
export { QrCode } from './components/qr-code'
export { TABLE_DEFAULTS, TABLE_LIMITS } from './collections/tables/constants'
export { buildTableQrUrl, newQrKey, qrSvg, tableLabel } from './qr'
