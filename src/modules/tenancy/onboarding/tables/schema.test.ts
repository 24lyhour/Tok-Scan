import { describe, expect, it } from 'vitest'

import { validate } from '../errors'
import { tablesSchema } from './schema'

describe('tablesSchema', () => {
     it('accepts 1–200 whole tables', () => {
          expect(validate(tablesSchema, { zone: 'Indoor', count: '16' })).toEqual({
               ok: true,
               data: { zone: 'Indoor', count: 16, returnTo: 'dashboard' },
          })
     })

     it('returns to the app Tables page only when asked', () => {
          const go = (returnTo?: string) => {
               const r = validate(tablesSchema, { zone: 'Indoor', count: '4', returnTo })
               return r.ok && r.data.returnTo
          }
          expect(go('tables')).toBe('tables')
          expect(go(undefined)).toBe('dashboard')
          expect(go('https://evil.example')).toBe('dashboard')
     })

     it('puts tables in "Indoor" when the zone is left empty', () => {
          const result = validate(tablesSchema, { zone: '  ', count: '4' })
          expect(result.ok && result.data.zone).toBe('Indoor')
     })

     it.each(['0', '201', '2.5', 'abc'])('rejects %s tables', (count) => {
          expect(validate(tablesSchema, { zone: 'Indoor', count })).toEqual({
               ok: false,
               fieldErrors: { count: 'tableCount' },
          })
     })
})
