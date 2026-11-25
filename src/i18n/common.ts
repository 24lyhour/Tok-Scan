/**
 * `common` namespace — short strings any screen can reuse (buttons, states, language names).
 * Feature-specific text belongs in that feature's own content.ts.
 */
import type { Translations } from '@/shared/i18n/site-locale'

const en = {
     language: 'Language',
     languages: { en: 'English', km: 'Khmer', zh: 'Chinese' },
     home: 'tok-scan home',
     poweredBy: 'Powered by',
     actions: {
          continue: 'Continue',
          back: 'Back',
          cancel: 'Cancel',
          save: 'Save',
          saveChanges: 'Save changes',
          close: 'Close',
          edit: 'Edit',
          delete: 'Delete',
          tryAgain: 'Try again',
          logIn: 'Log in',
          logOut: 'Log out',
     },
     states: {
          loading: 'Loading…',
          saving: 'Saving…',
          saved: 'Saved',
          empty: 'Nothing here yet',
          error: 'Something went wrong. Please try again.',
          required: 'Required',
          optional: 'Optional',
     },
}

export type CommonMessages = typeof en

const km: CommonMessages = {
     language: 'ភាសា',
     languages: { en: 'អង់គ្លេស', km: 'ខ្មែរ', zh: 'ចិន' },
     home: 'ទំព័រដើម tok-scan',
     poweredBy: 'ដំណើរការដោយ',
     actions: {
          continue: 'បន្ត',
          back: 'ត្រឡប់ក្រោយ',
          cancel: 'បោះបង់',
          save: 'រក្សាទុក',
          saveChanges: 'រក្សាទុកការផ្លាស់ប្តូរ',
          close: 'បិទ',
          edit: 'កែសម្រួល',
          delete: 'លុប',
          tryAgain: 'ព្យាយាមម្តងទៀត',
          logIn: 'ចូលគណនី',
          logOut: 'ចាកចេញ',
     },
     states: {
          loading: 'កំពុងផ្ទុក…',
          saving: 'កំពុងរក្សាទុក…',
          saved: 'បានរក្សាទុក',
          empty: 'មិនទាន់មានអ្វីនៅឡើយ',
          error: 'មានបញ្ហាអ្វីមួយ។ សូមព្យាយាមម្តងទៀត។',
          required: 'ត្រូវបំពេញ',
          optional: 'មិនបង្ខំ',
     },
}

const zh: CommonMessages = {
     language: '语言',
     languages: { en: '英语', km: '高棉语', zh: '中文' },
     home: 'tok-scan 首页',
     poweredBy: '技术支持',
     actions: {
          continue: '继续',
          back: '返回',
          cancel: '取消',
          save: '保存',
          saveChanges: '保存更改',
          close: '关闭',
          edit: '编辑',
          delete: '删除',
          tryAgain: '重试',
          logIn: '登录',
          logOut: '退出登录',
     },
     states: {
          loading: '加载中…',
          saving: '保存中…',
          saved: '已保存',
          empty: '暂无内容',
          error: '出现问题，请重试。',
          required: '必填',
          optional: '选填',
     },
}

export const commonMessages: Translations<CommonMessages> = { en, km, zh }
