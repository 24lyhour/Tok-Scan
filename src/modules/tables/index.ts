/**
 * Module 10 — Tables & QR codes (guide p.15). Tenant- and outlet-scoped.
 *
 *   collections/   data: tables              (backend entry: payload.ts)
 *   qr.ts          QR links + SVG drawing
 *   components/    QrCode · TableStatusGrid
 *   status.ts      table statuses + their colours
 *
 * Public API — safe to import from pages, server actions and client components.
 */
export { QrCode } from './components/qr-code'
export { TableStatusGrid, type GridTable } from './components/table-status-grid'
export { TABLE_DEFAULTS, TABLE_LIMITS } from './collections/tables/constants'
export { buildTableQrUrl, newQrKey, qrSvg, tableLabel } from './qr'
export { TABLE_STATUS_STYLES, TABLE_STATUSES, type TableStatus } from './status'
