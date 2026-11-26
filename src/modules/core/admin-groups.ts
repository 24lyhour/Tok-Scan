/**
 * Menu groups in the Payload admin (the super-admin console) — every collection picks one,
 * so the labels are written once. The admin UI speaks en · zh.
 */
export const ADMIN_GROUPS = {
     /** tok-scan itself: organizations, users */
     platform: { en: 'Platform', zh: '平台' },
     /** Data that belongs to one restaurant: outlets, tables, media … */
     restaurant: { en: 'Restaurant data', zh: '餐厅数据' },
} as const
