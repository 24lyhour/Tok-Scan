import { describe, expect, it } from 'vitest'

import { validate } from '../errors'
import { normalizeCambodianPhone, signupSchema } from './schema'

describe('normalizeCambodianPhone', () => {
     it.each([
          ['012 345 678', '+85512345678'],
          ['12-345-678', '+85512345678'],
          ['+855 96 123 4567', '+855961234567'],
          ['999', null],
     ])('%s → %s', (raw, e164) => {
          expect(normalizeCambodianPhone(raw)).toBe(e164)
     })
})

describe('signupSchema', () => {
     const valid = {
          name: '  Sok   Dara ',
          email: ' Sok@Mahob.COM ',
          phone: '012 345 678',
          password: 'longenough1',
          terms: 'on',
     }

     it('cleans valid input', () => {
          const result = validate(signupSchema, valid)
          expect(result).toMatchObject({
               ok: true,
               data: { name: 'Sok Dara', email: 'sok@mahob.com', phone: '+85512345678' },
          })
     })

     it('reports one code per field', () => {
          expect(validate(signupSchema, {})).toEqual({
               ok: false,
               fieldErrors: {
                    name: 'required',
                    email: 'required',
                    phone: 'required',
                    password: 'required',
                    terms: 'termsRequired',
               },
          })
          expect(
               validate(signupSchema, { ...valid, email: 'x@y', phone: '999', password: 'short' }),
          ).toEqual({
               ok: false,
               fieldErrors: {
                    email: 'emailInvalid',
                    phone: 'phoneInvalid',
                    password: 'passwordShort',
               },
          })
     })
})
