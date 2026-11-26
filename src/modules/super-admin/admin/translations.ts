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
     panelTitle: 'Every restaurant on tok-scan, in one place.',
     panelPoint1: 'Approve new restaurants before they take online payments',
     panelPoint2: 'Help owners when they get stuck',
     panelPoint3: 'Every action on restaurant data is logged',
     panelPending: 'Pending approvals',
     panelApprove: 'Approve',
     ownerLogin: 'Restaurant owner?',
     ownerLoginLink: 'Log in to your restaurant',
     subtitle:
          'This is the raw data admin. Approve, suspend and support restaurants in the console.',
     openConsole: 'Open the console',
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
     panelTitle: 'tok-scan 上的所有餐厅，尽在一处。',
     panelPoint1: '在餐厅开通在线收款前进行审核',
     panelPoint2: '在店主遇到问题时提供帮助',
     panelPoint3: '对餐厅数据的每一次操作都会被记录',
     panelPending: '待审核',
     panelApprove: '批准',
     ownerLogin: '您是餐厅老板？',
     ownerLoginLink: '登录您的餐厅',
     subtitle: '这里是原始数据后台。请在控制台中审核、暂停和支持餐厅。',
     openConsole: '打开控制台',
     status_trial: '试用',
     status_pending_approval: '待审核',
     status_active: '已启用',
     status_suspended: '已暂停',
     status_closed: '已关闭',
}

/** Namespace used in `t('tokscan:…')` */
export const ADMIN_NS = 'tokscan'

export const superAdminTranslations = { en: { [ADMIN_NS]: en }, zh: { [ADMIN_NS]: zh } }

/** Typed shortcut: tr(i18n.t, 'console') */
export function tr(t: (key: never) => string, key: PlatformAdminKey): string {
     return t(`${ADMIN_NS}:${key}` as never)
}
