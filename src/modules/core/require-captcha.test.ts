import { describe, expect, it } from 'vitest'

import { readCookie } from './require-captcha'

describe('readCookie', () => {
     it('finds a cookie among others', () => {
          expect(readCookie('a=1; tok-captcha=abc.def; b=2', 'tok-captcha')).toBe('abc.def')
     })
     it('keeps "=" inside the value', () => {
          expect(readCookie('tok-captcha=a=b', 'tok-captcha')).toBe('a=b')
     })
     it('is undefined when missing', () => {
          expect(readCookie('a=1', 'tok-captcha')).toBeUndefined()
          expect(readCookie(null, 'tok-captcha')).toBeUndefined()
     })
})
