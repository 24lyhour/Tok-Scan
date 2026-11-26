import { describe, expect, it } from 'vitest'

import { validate } from '../errors'
import { tablesSchema } from './schema'

describe('tablesSchema', () => {
     it('accepts 1–200 whole tables and reads the button pressed', () => {
          expect(validate(tablesSchema, { zone: 'Indoor', count: '16', intent: 'print' })).toEqual({
               ok: true,
               data: { zone: 'Indoor', count: 16, intent: 'print' },
          })
     })

     it('defaults to "finish" for an unknown button', () => {
          const result = validate(tablesSchema, { zone: 'Indoor', count: '1', intent: 'x' })
          expect(result.ok && result.data.intent).toBe('finish')
     })

     it.each(['0', '201', '2.5', 'abc'])('rejects %s tables', (count) => {
          expect(validate(tablesSchema, { zone: 'Indoor', count })).toEqual({
               ok: false,
               fieldErrors: { count: 'tableCount' },
          })
     })
})
