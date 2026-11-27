/** Chinese (Simplified) — have a native speaker review before launch. */
import type { AuthContent } from '../en/auth'

export const auth: AuthContent = {
     social: {
          google: '使用 Google 继续',
          apple: '使用 Apple 继续',
          soon: 'Apple 和 Google 登录即将推出',
          appleSoon: 'Apple 登录即将推出',
          terms: '使用 Google 继续即表示您同意服务条款和隐私政策。',
          or: '或',
     },
     password: {
          show: '显示密码',
          hide: '隐藏密码',
     },
     googleErrors: {
          cancelled: '已取消 Google 登录。',
          failed: 'Google 登录失败，请重试或使用邮箱。',
          unverified: '您的 Google 账户邮箱尚未验证。请先在 Google 完成验证，或使用邮箱。',
          unavailable: '暂时无法使用 Google 登录，请使用邮箱。',
     },
     errors: {
          required: '此项为必填项。',
          emailInvalid: '请输入有效的邮箱地址，例如 you@restaurant.com。',
          invalidCredentials: '邮箱和密码不匹配，请检查后重试。',
          locked: '失败次数过多，您的账户已被锁定 10 分钟——也可以重置密码。',
          captcha: '安全检查尚未完成。请稍候，然后重试。',
          generic: '出现问题，请重试。',
     },
     login: {
          metaTitle: '登录',
          title: '欢迎回来',
          subtitle: '登录以管理您的餐厅。',
          staffTitle: '平台控制台',
          staffSubtitle: '仅限 tok-scan 团队。请使用员工邮箱登录。',
          email: '邮箱',
          emailPlaceholder: 'you@restaurant.com',
          password: '密码',
          forgot: '忘记密码？',
          submit: '登录',
          submitting: '正在登录…',
          noAccount: '第一次使用 tok·scan？',
          startTrial: '开始免费试用',
     },
     aside: {
          title: '所有餐桌，实时汇聚一处。',
          body: '所有门店的订单、厨房小票和 KHQR 付款——发生即可见。',
          points: [
               '每张桌的订单几秒内送达',
               '厨房即时看到备注和过敏信息',
               '银行确认后才标记为已付款',
          ],
          ticketTable: 'T07',
          ticketItem: '2× 阿莫克鱼',
          ticketNote: '不要辣 · 加米饭',
          paid: '已支付 · KHQR',
          markReady: '标记完成',
     },
}
