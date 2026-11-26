import { describe, expect, it } from 'vitest'

import { matchTopic, REPLY_ACTIONS, STARTING_PRICE } from './topics'

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
     ])('%s → %s', (question, topic) => {
          expect(matchTopic(question)).toBe(topic)
     })

     it('starts at the cheapest paid plan', () => {
          expect(STARTING_PRICE).toBe(19)
     })

     it('sends unknown questions to the team on Telegram', () => {
          expect(REPLY_ACTIONS.fallback.href).toMatch(/^https:\/\/t\.me\//)
     })
})
