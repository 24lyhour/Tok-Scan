/**
 * TOKSCAN preview: the topics it can answer, the button under each answer, and simple keyword
 * matching for typed questions (en · km · zh). Replaced by the real AI later — the widget only
 * needs `replyFor(text)`-style data, so the UI won't change.
 */
import { links, plans } from '../landing/content/data'

export const TOPIC_IDS = ['how', 'khqr', 'pricing', 'trial'] as const
export type TopicId = (typeof TOPIC_IDS)[number]
export type ReplyId = TopicId | 'fallback'

/** Cheapest monthly plan — fills `{price}` in the pricing answer */
export const STARTING_PRICE = Math.min(
     ...plans.flatMap((p) => (p.monthly === null ? [] : [p.monthly])),
)

/** Button under each answer */
export const REPLY_ACTIONS: Record<
     ReplyId,
     { action: 'trial' | 'pricing' | 'contact'; href: string }
> = {
     how: { action: 'trial', href: links.signup },
     khqr: { action: 'trial', href: links.signup },
     pricing: { action: 'pricing', href: '#pricing' },
     trial: { action: 'trial', href: links.signup },
     fallback: { action: 'contact', href: links.telegram },
}

/** Keywords per topic, checked in this order (pricing before "how": "how much…") */
const KEYWORDS: [TopicId, RegExp][] = [
     ['pricing', /price|pricing|cost|how much|plan|\$|តម្លៃ|ថ្លៃ|价格|多少钱|费用|套餐/i],
     ['khqr', /khqr|aba|payway|pay|bank|card|cash|បង់|ទូទាត់|付款|支付|银行/i],
     ['trial', /trial|start|sign ?up|register|account|free|សាកល្បង|ចុះឈ្មោះ|试用|注册|开始/i],
     ['how', /qr|order|menu|scan|kitchen|table|how|កុម្ម៉ង់|ម៉ឺនុយ|ស្កេន|点餐|菜单|扫码|怎么/i],
]

/** Which ready-made answer fits a typed question. */
export function matchTopic(text: string): ReplyId {
     return KEYWORDS.find(([, re]) => re.test(text))?.[0] ?? 'fallback'
}
