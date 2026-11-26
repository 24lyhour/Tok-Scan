import { describe, expect, it } from 'vitest'

import { matchTopic, REPLY_ACTIONS, TOPICS } from './topics'

describe('TOKSCAN preview answers', () => {
     it.each([
          ['How much does it cost?', 'pricing'],
          ['តើតម្លៃប៉ុន្មាន?', 'pricing'],
          ['价格是多少', 'pricing'],
          ['Can I pay with ABA?', 'khqr'],
          ['客人可以用KHQR付款吗', 'khqr'],
          ['How do guests order from the table?', 'how'],
          ['I want a free trial', 'trial'],
          ['Do you sell coffee machines?', 'fallback'],
     ])('visitor: %s → %s', (question, topic) => {
          expect(matchTopic(question, 'visitor')).toBe(topic)
     })

     it.each([
          ['How do I add my dishes?', 'menu'],
          ['ម៉ឺនុយ', 'menu'],
          ['How do I connect ABA PayWay?', 'payments'],
          ['Invite my waiter', 'staff'],
          ['打印二维码', 'qr'],
          ['What is the weather?', 'fallback'],
     ])('owner: %s → %s', (question, topic) => {
          expect(matchTopic(question, 'owner')).toBe(topic)
     })

     it('every suggested question has an answer action defined', () => {
          for (const id of [...TOPICS.visitor, ...TOPICS.owner])
               expect(id in REPLY_ACTIONS).toBe(true)
     })
})
