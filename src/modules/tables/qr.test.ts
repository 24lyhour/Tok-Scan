import { describe, expect, it } from 'vitest'

import { buildTableQrUrl, newQrKey, qrSvg, tableLabel } from './qr'

describe('table QR helpers', () => {
     it('labels tables T01 … T100', () => {
          expect([1, 7, 10, 100].map(tableLabel)).toEqual(['T01', 'T07', 'T10', 'T100'])
     })

     it('builds the guest link', () => {
          expect(buildTableQrUrl('https://tok-scan.store', 'mahob', 'T07', 'Q7x2abcd')).toBe(
               'https://tok-scan.store/r/mahob/t/T07?k=Q7x2abcd',
          )
     })

     it('makes 8-character URL-safe keys', () => {
          const keys = new Set(Array.from({ length: 50 }, newQrKey))
          expect(keys.size).toBe(50)
          for (const k of keys) expect(k).toMatch(/^[A-Za-z0-9]{8}$/)
     })

     it('draws an SVG', async () => {
          expect(await qrSvg('https://tok-scan.store/r/mahob/t/T01')).toMatch(/^<svg/)
     })
})
