import type { AssistantContent } from './en'

export const zh: AssistantContent = {
     launcher: {
          open: '与 TOKSCAN 聊天',
          close: '关闭聊天',
     },
     greeting: {
          hello: '尊敬的客户，您好',
          question: 'tok-scan 能为您做些什么？',
          dismiss: '关闭消息',
     },
     panel: {
          title: 'TOKSCAN',
          subtitle: 'AI 助手 · 预览版',
          online: '在线',
          close: '关闭',
          expand: '全屏',
          collapse: '退出全屏',
          welcome: '您好！我是 TOKSCAN，tok-scan 的智能助手。您可以问我扫码点餐、KHQR 付款、价格或如何开始使用。',
          suggestionsLabel: '推荐问题',
          placeholder: '向 TOKSCAN 提问…',
          send: '发送',
          typing: 'TOKSCAN 正在输入…',
          disclaimer: '预览版 —— TOKSCAN 目前只提供简短的预设回答，完整 AI 即将推出。',
     },
     topics: {
          how: '扫码点餐是怎么运作的？',
          khqr: '客人可以用 KHQR 付款吗？',
          pricing: '价格是多少？',
          trial: '开始免费试用',
     },
     answers: {
          how: '客人扫描餐桌上的二维码，即可用英文、高棉文或中文查看菜单并用手机下单。厨房会立即收到订单，账单可通过 KHQR 或在收银台支付。',
          khqr: '可以！客人可以用手机通过 KHQR / ABA PayWay 付款，账单只有在银行确认后才会标记为已付款。也可以在收银台付现金。',
          pricing: '套餐每月 {price} 起，可免费试用 14 天，无需绑卡。',
          trial: '好选择！创建账户后，添加您的餐厅、第一家门店和餐桌，只需几分钟。',
          fallback:
               '感谢您的提问！我目前还是预览版，只能回答少数话题。请试试下面的问题，或通过 Telegram 联系我们的团队。',
     },
     actions: {
          trial: '开始免费试用',
          pricing: '查看价格',
          contact: '联系我们的团队',
     },
}
