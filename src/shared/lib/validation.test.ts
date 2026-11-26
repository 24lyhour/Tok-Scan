import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import {
     createValidator,
     emailField,
     formValues,
     numberField,
     optionalText,
     requiredText,
     switchField,
} from './validation'

const validate = createValidator<string>()
const form = (entries: [string, string][]) => {
     const data = new FormData()
     for (const [k, v] of entries) data.append(k, v)
     return data
}

describe('formValues', () => {
     it('keeps the first value of normal fields and all values of list fields', () => {
          const values = formValues(
               form([
                    ['name', 'A'],
                    ['name', 'B'],
                    ['days', 'mon'],
                    ['days', 'fri'],
               ]),
               ['days', 'tags'],
          )
          expect(values).toEqual({ name: 'A', days: ['mon', 'fri'], tags: [] })
     })
})

describe('createValidator', () => {
     const schema = z.object({ name: requiredText(5), note: optionalText(3) })

     it('returns clean data when valid', () => {
          expect(validate(schema, { name: '  a   b ' })).toEqual({
               ok: true,
               data: { name: 'a b', note: '' },
          })
     })

     it('returns the first error code per field', () => {
          expect(validate(schema, { name: '', note: 'toolong' })).toEqual({
               ok: false,
               fieldErrors: { name: 'required', note: 'tooLong' },
          })
     })
})

describe('field helpers', () => {
     it('emailField trims, lower-cases and separates required / invalid', () => {
          expect(emailField().parse(' Sok@Mahob.COM ')).toBe('sok@mahob.com')
          expect(emailField().safeParse('').error?.issues[0]?.message).toBe('required')
          expect(emailField().safeParse('nope').error?.issues[0]?.message).toBe('emailInvalid')
     })

     it('numberField accepts "4,100" and rejects text / out of range', () => {
          const rate = numberField('number', 1000, 10000)
          expect(rate.parse('4,100')).toBe(4100)
          expect(rate.safeParse('abc').success).toBe(false)
          expect(rate.safeParse('99999').success).toBe(false)
     })

     it('switchField reads on/off and treats missing as off', () => {
          expect(switchField().parse('on')).toBe(true)
          expect(switchField().parse('off')).toBe(false)
          expect(switchField().parse(undefined)).toBe(false)
     })
})
