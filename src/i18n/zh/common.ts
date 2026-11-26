/** Chinese (Simplified) — have a native speaker review before launch. */
import type { CommonMessages } from '../en/common'

export const common: CommonMessages = {
     meta: {
          title: 'tok·scan — 柬埔寨餐厅的扫码点餐与结账系统',
          titleTemplate: '%s · tok·scan',
          description:
               '顾客用手机点餐，厨房即时看到，账单通过 KHQR 支付。一家餐厅或二十家门店皆适用。',
     },
     language: '语言',
     home: 'tok-scan 首页',
     skipToContent: '跳到主要内容',
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
          soon: '即将推出',
          /** Under a disabled button — followed by a red * */
          fillRequired: '请填写所有标有星号的字段',
     },
}
