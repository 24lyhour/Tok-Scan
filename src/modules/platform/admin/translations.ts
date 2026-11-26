/**
 * Super-admin console text — Payload admin translations (the admin UI speaks en · zh only).
 * Used as `t('tokscan:<key>')`. English is the source of truth; Chinese must have every key.
 */
import type { OrgStatus } from '@/modules/tenancy'

const en = {
     console: 'Platform console',
     consoleBadge: 'Platform console · staff only',
     loginTitle: 'Welcome back',
     loginSubtitle: 'Log in with your tok-scan staff account.',
     ownerLogin: 'Restaurant owner?',
     ownerLoginLink: 'Log in to your restaurant',
     subtitle:
          'Every restaurant on tok-scan. Only tok-scan staff (super-admin) can open this admin.',
     statOrganizations: 'Organizations',
     statActive: 'Active',
     statTrial: 'On trial',
     statPending: 'Pending approval',
     statSuspended: 'Suspended',
     statOutlets: 'Outlets',
     statTables: 'Tables',
     pendingTitle: 'Waiting for approval',
     pendingEmpty: 'Nothing is waiting for approval.',
     recentTitle: 'Newest sign-ups',
     recentEmpty: 'No restaurants yet.',
     colOrganization: 'Organization',
     colOwner: 'Owner',
     colStatus: 'Status',
     colSignedUp: 'Signed up',
     review: 'Review',
     viewAll: 'All organizations',
     status_trial: 'Trial',
     status_pending_approval: 'Pending approval',
     status_active: 'Active',
     status_suspended: 'Suspended',
     status_closed: 'Closed',
} satisfies Record<string, string> & Record<`status_${OrgStatus}`, string>

export type PlatformAdminKey = keyof typeof en

const zh: Record<PlatformAdminKey, string> = {
     console: '平台控制台',
     consoleBadge: '平台控制台 · 仅限员工',
     loginTitle: '欢迎回来',
     loginSubtitle: '使用您的 tok-scan 员工账号登录。',
     ownerLogin: '您是餐厅老板？',
     ownerLoginLink: '登录您的餐厅',
     subtitle: 'tok-scan 上的所有餐厅。只有 tok-scan 员工（超级管理员）可以打开此后台。',
     statOrganizations: '机构',
     statActive: '已启用',
     statTrial: '试用中',
     statPending: '待审核',
     statSuspended: '已暂停',
     statOutlets: '门店',
     statTables: '餐桌',
     pendingTitle: '等待审核',
     pendingEmpty: '没有等待审核的餐厅。',
     recentTitle: '最新注册',
     recentEmpty: '还没有餐厅。',
     colOrganization: '机构',
     colOwner: '所有者',
     colStatus: '状态',
     colSignedUp: '注册时间',
     review: '审核',
     viewAll: '所有机构',
     status_trial: '试用',
     status_pending_approval: '待审核',
     status_active: '已启用',
     status_suspended: '已暂停',
     status_closed: '已关闭',
}

/** Namespace used in `t('tokscan:…')` */
export const ADMIN_NS = 'tokscan'

export const platformAdminTranslations = { en: { [ADMIN_NS]: en }, zh: { [ADMIN_NS]: zh } }

/** Typed shortcut: tr(i18n.t, 'console') */
export function tr(t: (key: never) => string, key: PlatformAdminKey): string {
     return t(`${ADMIN_NS}:${key}` as never)
}
