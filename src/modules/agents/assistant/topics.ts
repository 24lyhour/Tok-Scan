/**
 * What TOKSCAN can answer, per audience, + simple keyword matching (en · km · zh).
 * The real AI replaces `matchTopic` later; the widget and its texts stay the same.
 */
export const AUDIENCES = ['visitor', 'owner'] as const
/** visitor = landing page (prospects) · owner = signed-in app (setting up a restaurant) */
export type Audience = (typeof AUDIENCES)[number]

/** Suggested questions, in order */
export const TOPICS = {
     visitor: ['how', 'khqr', 'pricing', 'trial'],
     owner: ['menu', 'payments', 'staff', 'qr'],
} as const
export type TopicId = (typeof TOPICS)[Audience][number]
export type ReplyId = TopicId | 'fallback'

/** Links a page gives the widget — each answer's button opens one of them */
export type LinkKey = 'signup' | 'pricing' | 'contact'
export type AssistantLinks = Partial<Record<LinkKey, string>>

/** The button under each answer (null = no button) */
export const REPLY_ACTIONS: Record<ReplyId, LinkKey | null> = {
     how: 'signup',
     khqr: 'signup',
     pricing: 'pricing',
     trial: 'signup',
     menu: 'contact',
     payments: 'contact',
     staff: 'contact',
     qr: null,
     fallback: 'contact',
}

/** Keywords per topic, checked in the audience's order (pricing before "how": "how much…") */
const KEYWORDS: Record<TopicId, RegExp> = {
     pricing: /price|pricing|cost|how much|plan|\$|តម្លៃ|ថ្លៃ|价格|多少钱|费用|套餐/i,
     khqr: /khqr|aba|payway|pay|bank|card|cash|បង់|ទូទាត់|付款|支付|银行/i,
     trial: /trial|start|sign ?up|register|account|free|សាកល្បង|ចុះឈ្មោះ|试用|注册|开始/i,
     how: /qr|order|menu|scan|kitchen|table|how|កុម្ម៉ង់|ម៉ឺនុយ|ស្កេន|点餐|菜单|扫码|怎么/i,
     menu: /menu|dish|food|item|csv|photo|ម៉ឺនុយ|ម្ហូប|菜单|菜品/i,
     payments: /khqr|aba|payway|pay|bank|ទូទាត់|បង់|付款|支付|银行/i,
     staff: /staff|invite|waiter|cashier|kitchen|team|role|បុគ្គលិក|អញ្ជើញ|员工|邀请/i,
     qr: /qr|print|code|sticker|stand|បោះពុម្ព|កូដ|打印|二维码/i,
}
const ORDER: Record<Audience, TopicId[]> = {
     visitor: ['pricing', 'khqr', 'trial', 'how'],
     owner: ['menu', 'payments', 'staff', 'qr'],
}

/** Which ready-made answer fits a typed question, for this audience. */
export function matchTopic(text: string, audience: Audience): ReplyId {
     return ORDER[audience].find((id) => KEYWORDS[id].test(text)) ?? 'fallback'
}
