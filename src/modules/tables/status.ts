/**
 * Table status (guide p.8 "Live tables", p.14 POS) — one colour per status, used by every
 * table grid (dashboard, POS, orders). The Orders module will set the status; today every
 * table is `available`.
 */
export const TABLE_STATUSES = ['available', 'occupied', 'ordering', 'awaiting'] as const
export type TableStatus = (typeof TABLE_STATUSES)[number]

export const TABLE_STATUS_STYLES: Record<TableStatus, string> = {
     available: 'bg-success/10 text-success',
     occupied: 'bg-info/10 text-info',
     ordering: 'bg-progress/10 text-progress',
     awaiting: 'bg-warning/15 text-warning',
}
