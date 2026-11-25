/**
 * `auth` namespace — login screen copy in English, Khmer and Chinese.
 * Khmer / Chinese copy: have a native speaker review before launch.
 */
import type { Translations } from '@/shared/i18n/site-locale'

import type { LoginErrorCode } from './validation'

const en = {
     login: {
          metaTitle: 'Log in',
          title: 'Welcome back',
          subtitle: 'Log in to run your restaurant.',
          google: 'Continue with Google',
          apple: 'Continue with Apple',
          socialSoon: 'Apple and Google sign-in are coming soon',
          or: 'or',
          email: 'Email',
          emailPlaceholder: 'you@restaurant.com',
          password: 'Password',
          forgot: 'Forgot password?',
          showPassword: 'Show password',
          hidePassword: 'Hide password',
          submit: 'Log in',
          submitting: 'Logging in…',
          noAccount: 'New to tok·scan?',
          startTrial: 'Start a free trial',
          errors: {
               required: 'This field is required.',
               emailInvalid: 'Enter a valid email address, like you@restaurant.com.',
               invalidCredentials: 'That email and password don’t match. Check them and try again.',
               locked: 'Too many failed attempts. Your account is locked for 10 minutes — or reset your password.',
               generic: 'Something went wrong. Please try again.',
          } satisfies Record<LoginErrorCode, string>,
     },
     aside: {
          title: 'Every table, live in one place.',
          body: 'Orders, kitchen tickets and KHQR payments from all your outlets — the moment they happen.',
          points: [
               'Orders arrive from every table in seconds',
               'The kitchen sees notes and allergies instantly',
               'Bills are marked paid only after the bank confirms',
          ],
          ticketTable: 'T07',
          ticketItem: '2× Fish Amok',
          ticketNote: 'No chilli · extra rice',
          paid: 'Paid · KHQR',
     },
}

export type AuthContent = typeof en

const km: AuthContent = {
     login: {
          metaTitle: 'ចូលគណនី',
          title: 'សូមស្វាគមន៍ការត្រឡប់មកវិញ',
          subtitle: 'ចូលគណនី ដើម្បីគ្រប់គ្រងភោជនីយដ្ឋានរបស់អ្នក។',
          google: 'បន្តជាមួយ Google',
          apple: 'បន្តជាមួយ Apple',
          socialSoon: 'ការចូលតាម Apple និង Google នឹងមានឆាប់ៗនេះ',
          or: 'ឬ',
          email: 'អ៊ីមែល',
          emailPlaceholder: 'you@restaurant.com',
          password: 'ពាក្យសម្ងាត់',
          forgot: 'ភ្លេចពាក្យសម្ងាត់?',
          showPassword: 'បង្ហាញពាក្យសម្ងាត់',
          hidePassword: 'លាក់ពាក្យសម្ងាត់',
          submit: 'ចូលគណនី',
          submitting: 'កំពុងចូល…',
          noAccount: 'ទើបស្គាល់ tok·scan?',
          startTrial: 'ចាប់ផ្តើមសាកល្បងឥតគិតថ្លៃ',
          errors: {
               required: 'សូមបំពេញព័ត៌មាននេះ។',
               emailInvalid: 'សូមបញ្ចូលអ៊ីមែលឲ្យបានត្រឹមត្រូវ ដូចជា you@restaurant.com។',
               invalidCredentials: 'អ៊ីមែល និងពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។ សូមពិនិត្យ ហើយព្យាយាមម្តងទៀត។',
               locked: 'ព្យាយាមខុសច្រើនដងពេក។ គណនីរបស់អ្នកត្រូវបានចាក់សោរយៈពេល ១០ នាទី — ឬកំណត់ពាក្យសម្ងាត់ថ្មី។',
               generic: 'មានបញ្ហាអ្វីមួយ។ សូមព្យាយាមម្តងទៀត។',
          },
     },
     aside: {
          title: 'គ្រប់តុ ផ្ទាល់ៗ នៅកន្លែងតែមួយ។',
          body: 'ការកុម្ម៉ង់ សំបុត្រផ្ទះបាយ និងការទូទាត់ KHQR ពីគ្រប់សាខារបស់អ្នក — ភ្លាមៗពេលវាកើតឡើង។',
          points: [
               'ការកុម្ម៉ង់មកដល់ពីគ្រប់តុក្នុងប៉ុន្មានវិនាទី',
               'ផ្ទះបាយឃើញកំណត់ចំណាំ និងអាឡែហ្ស៊ីភ្លាមៗ',
               'វិក្កយបត្របញ្ជាក់ថាបានបង់ លុះត្រាតែធនាគារបញ្ជាក់',
          ],
          ticketTable: 'T07',
          ticketItem: '2× អាម៉ុកត្រី',
          ticketNote: 'កុំដាក់ម្ទេស · បន្ថែមបាយ',
          paid: 'បានបង់ · KHQR',
     },
}

const zh: AuthContent = {
     login: {
          metaTitle: '登录',
          title: '欢迎回来',
          subtitle: '登录以管理您的餐厅。',
          google: '使用 Google 继续',
          apple: '使用 Apple 继续',
          socialSoon: 'Apple 和 Google 登录即将推出',
          or: '或',
          email: '邮箱',
          emailPlaceholder: 'you@restaurant.com',
          password: '密码',
          forgot: '忘记密码？',
          showPassword: '显示密码',
          hidePassword: '隐藏密码',
          submit: '登录',
          submitting: '正在登录…',
          noAccount: '第一次使用 tok·scan？',
          startTrial: '开始免费试用',
          errors: {
               required: '此项为必填项。',
               emailInvalid: '请输入有效的邮箱地址，例如 you@restaurant.com。',
               invalidCredentials: '邮箱和密码不匹配，请检查后重试。',
               locked: '失败次数过多，您的账户已被锁定 10 分钟——也可以重置密码。',
               generic: '出现问题，请重试。',
          },
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
     },
}

export const authContent: Translations<AuthContent> = { en, km, zh }
