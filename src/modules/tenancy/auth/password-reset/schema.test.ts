import { describe, expect, it } from 'vitest'

import { validate } from '../errors'
import { forgotSchema, resetSchema } from './schema'

describe('forgotSchema', () => {
     it('accepts and normalises an email', () => {
          expect(validate(forgotSchema, { email: '  Owner@Mahob.KH ' })).toEqual({
               ok: true,
               data: { email: 'owner@mahob.kh' },
          })
     })
     it('rejects a bad email', () => {
          expect(validate(forgotSchema, { email: 'nope' })).toEqual({
               ok: false,
               fieldErrors: { email: 'emailInvalid' },
          })
     })
})

describe('resetSchema', () => {
     const ok = { token: 'abc123', password: 'long-enough-1', confirm: 'long-enough-1' }
     it('accepts matching passwords of 10+ characters', () => {
          expect(validate(resetSchema, ok).ok).toBe(true)
     })
     it('needs at least 10 characters', () => {
          expect(
               validate(resetSchema, { ...ok, password: 'short', confirm: 'short' }),
          ).toMatchObject({
               fieldErrors: { password: 'passwordShort' },
          })
     })
     it('needs both passwords to match', () => {
          expect(validate(resetSchema, { ...ok, confirm: 'different-1' })).toMatchObject({
               fieldErrors: { confirm: 'passwordMismatch' },
          })
     })
     it('needs the token from the email', () => {
          expect(validate(resetSchema, { ...ok, token: '' })).toMatchObject({
               fieldErrors: { token: 'tokenInvalid' },
          })
     })
})
