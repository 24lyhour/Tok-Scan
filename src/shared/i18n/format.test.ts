import { describe, expect, it } from 'vitest'

import { formatMoney, formatMonth, formatTime, interpolate, localizeDigits, plural } from './format'

describe('formatTime', () => {
     it('uses each language’s clock', () => {
          expect(formatTime('22:00', 'en')).toMatch(/^10:00\sPM$/)
          expect(formatTime('22:00', 'zh')).toBe('22:00')
          expect(formatTime('22:00', 'km')).toBe('២២:០០')
          expect(formatTime('09:30', 'km')).toBe('០៩:៣០')
     })
})

describe('other formatters', () => {
     it('fills placeholders and keeps unknown ones', () => {
          expect(interpolate('{n} of {total}', { n: 2 })).toBe('2 of {total}')
     })

     it('writes Khmer numerals only for km', () => {
          expect(localizeDigits(16, 'km')).toBe('១៦')
          expect(localizeDigits(16, 'en')).toBe('16')
     })

     it('picks plural forms', () => {
          const forms = { one: '{count} table', other: '{count} tables' }
          expect(plural('en', 1, forms)).toBe('1 table')
          expect(plural('en', 3, forms)).toBe('3 tables')
     })

     it('formats money like Cambodian menus', () => {
          expect(formatMoney(19)).toBe('$19')
          expect(formatMoney(6.5)).toBe('$6.50')
          expect(formatMoney(26700, 'KHR')).toMatch(/^KHR\s26,700$/)
     })
})

describe('formatMonth', () => {
     it('shows month and year', () => {
          expect(formatMonth('2026-08-14T10:00:00Z', 'en')).toBe('Aug 2026')
     })
})
