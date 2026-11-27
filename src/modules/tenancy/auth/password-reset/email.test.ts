import { describe, expect, it } from 'vitest'

import { resetPasswordEmail, resetUrl } from './email'

describe('resetUrl', () => {
     it('points to tok-scan’s reset page with the token', () => {
          expect(resetUrl('https://tok-scan.store/', 'a b')).toBe(
               'https://tok-scan.store/reset-password?token=a%20b',
          )
     })
})

describe('resetPasswordEmail', () => {
     const base = { origin: 'https://tok-scan.store', token: 'tok123' }

     it('has the branded button linking to the reset page', () => {
          const { subject, html } = resetPasswordEmail({ ...base, name: 'Dara', locale: 'en' })
          expect(subject).toBe('Reset your tok-scan password')
          expect(html).toContain('href="https://tok-scan.store/reset-password?token=tok123"')
          expect(html).toContain('>Reset password</a>')
          expect(html).toContain('Hi Dara,')
          expect(html).toContain('https://tok-scan.store/icon-192.png')
     })

     it('escapes names so they can’t inject HTML', () => {
          const { html } = resetPasswordEmail({ ...base, name: '<b>x</b>', locale: 'en' })
          expect(html).toContain('&lt;b&gt;x&lt;/b&gt;')
          expect(html).not.toContain('<b>x</b>')
     })

     it('speaks the reader’s language', () => {
          expect(resetPasswordEmail({ ...base, locale: 'zh' }).subject).toBe(
               '重置您的 tok-scan 密码',
          )
          expect(resetPasswordEmail({ ...base, locale: 'km' }).html).toContain('lang="km"')
     })
})
