import { describe, expect, it } from 'vitest'

import { baseOrgCode, checkSlugFormat, slugCandidates, slugify } from './slug'

describe('slugify', () => {
     it.each([
          ['Mahob Kitchen & Bar!', 'mahob-kitchen-and-bar'],
          ['  Café  Sâmbok ', 'cafe-sambok'],
          ['---a---b---', 'a-b'],
          ['ម្ហូប', ''], // Khmer only → owner types an address
     ])('%s → %s', (input, expected) => {
          expect(slugify(input)).toBe(expected)
     })

     it('never exceeds 40 characters or ends with a hyphen', () => {
          const slug = slugify('a'.repeat(39) + ' bcd')
          expect(slug.length).toBeLessThanOrEqual(40)
          expect(slug.endsWith('-')).toBe(false)
     })
})

describe('checkSlugFormat', () => {
     it.each([
          ['ab', 'tooShort'],
          ['a'.repeat(41), 'tooLong'],
          ['Bad_Slug', 'invalid'],
          ['admin', 'reserved'],
          ['dashboard', 'reserved'],
          ['mahob', null],
     ])('%s → %s', (slug, problem) => {
          expect(checkSlugFormat(slug)).toBe(problem)
     })
})

describe('slugCandidates', () => {
     it('suggests valid alternatives, business type first', () => {
          const list = slugCandidates('mahob', 'food_court')
          expect(list[0]).toBe('mahob-food-court')
          expect(list).toContain('mahob-kh')
          expect(list.every((s) => checkSlugFormat(s) === null)).toBe(true)
     })

     it('turns a reserved word into free alternatives', () => {
          expect(slugCandidates('admin')).toEqual([
               'admin-kh',
               'admin-pp',
               'admin-official',
               'admin-2',
               'admin-3',
          ])
     })

     it('returns nothing for an empty address', () => {
          expect(slugCandidates('')).toEqual([])
     })
})

describe('baseOrgCode', () => {
     it.each([
          ['Mahob', 'MHB'],
          ['Mahob Test Kitchen', 'MTK'],
          ['Sok Dara', 'SDK'],
          ['ម្ហូប', 'ORG'],
     ])('%s → %s', (name, code) => {
          expect(baseOrgCode(name)).toBe(code)
     })
})
