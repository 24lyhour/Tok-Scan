import { describe, expect, it } from 'vitest'

import { isOvernight, timeSlots } from './time'

describe('timeSlots', () => {
     it('makes a full day of 30-minute slots', () => {
          const slots = timeSlots()
          expect(slots).toHaveLength(48)
          expect(slots[0]).toBe('00:00')
          expect(slots.at(-1)).toBe('23:30')
     })

     it('supports other steps', () => {
          expect(timeSlots(60)).toHaveLength(24)
          expect(timeSlots(15).slice(0, 3)).toEqual(['00:00', '00:15', '00:30'])
     })

     it('limits to a range (e.g. bookings during opening hours)', () => {
          expect(timeSlots(60, { min: '10:00', max: '13:00' })).toEqual([
               '10:00',
               '11:00',
               '12:00',
               '13:00',
          ])
     })
})

describe('isOvernight', () => {
     it.each([
          ['10:00', '22:00', false],
          ['18:00', '02:00', true],
          ['10:00', '10:00', true],
     ])('%s → %s overnight: %s', (opens, closes, expected) => {
          expect(isOvernight(opens, closes)).toBe(expected)
     })
})
