/**
 * tok-scan table — reusable for every list (organizations, orders, invoices, payments, staff…).
 * Data-free: the page passes rows, columns, texts and links. Server-rendered; filters and pages
 * live in the URL.
 *
 *   <TableCard>
 *        <TableTabs …/>          status tabs with counts
 *        <TableSearch …>         search (+ <TableToolButton> for filters / CSV)
 *        <TokScanTable …/>       the table
 *        <TablePagination …/>    "Showing 1–10 of 141" + pages
 *   </TableCard>
 */
export { TableCard, TokScanTable, type TableColumn } from './table'
export { TablePagination, visiblePages } from './table-pagination'
export { TableSearch, TableToolButton } from './table-search'
export { TableTabs, type TableTab } from './table-tabs'
