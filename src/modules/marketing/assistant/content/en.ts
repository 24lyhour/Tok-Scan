/** English — the source of truth: every other language must have exactly the same keys. */
import type { TopicId } from '../topics'

export const en = {
     launcher: {
          open: 'Chat with TOKSCAN',
          close: 'Close chat',
     },
     greeting: {
          hello: 'Hello valued customer',
          question: 'How can tok-scan help you?',
          dismiss: 'Dismiss message',
     },
     panel: {
          title: 'TOKSCAN',
          subtitle: 'AI assistant · Preview',
          online: 'Online',
          close: 'Close',
          expand: 'Full screen',
          collapse: 'Exit full screen',
          welcome: 'Hi! I’m TOKSCAN, the tok-scan assistant. Ask me about QR ordering, KHQR payments, pricing or getting started.',
          suggestionsLabel: 'Suggested questions',
          placeholder: 'Ask TOKSCAN…',
          send: 'Send',
          typing: 'TOKSCAN is typing…',
          disclaimer:
               'Preview — TOKSCAN gives short, ready-made answers for now. Full AI is coming soon.',
     },
     /** Suggested questions (chips) */
     topics: {
          how: 'How does QR ordering work?',
          khqr: 'Can guests pay with KHQR?',
          pricing: 'How much does it cost?',
          trial: 'Start a free trial',
     } satisfies Record<TopicId, string>,
     /** Ready-made answers — `{price}` is filled in from the plan data */
     answers: {
          how: 'Guests scan the QR code on their table, see your menu in English, Khmer or Chinese, and order from their phone. The kitchen sees the order instantly, and the bill is paid by KHQR or at the counter.',
          khqr: 'Yes! Guests can pay by KHQR / ABA PayWay from their phone, and a bill is marked paid only after the bank confirms. Cash at the counter works too.',
          pricing: 'Plans start at {price} per month, with a 14-day free trial — no card needed.',
          trial: 'Great choice! Create your account, then add your restaurant, first outlet and tables. It only takes a few minutes.',
          fallback:
               'Thanks for your question! I’m still in preview, so I can only answer a few topics for now. Try a question below, or talk to our team on Telegram.',
     } satisfies Record<TopicId | 'fallback', string>,
     actions: {
          trial: 'Start free trial',
          pricing: 'See pricing',
          contact: 'Talk to our team',
     },
}

export type AssistantContent = typeof en
