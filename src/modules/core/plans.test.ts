import { describe, expect, it } from 'vitest'

import { limitsFor, PLAN_LIMITS, TRIAL_PLAN } from './plans'

describe('plans', () => {
     it('the free trial gets Growth limits', () => {
          expect(TRIAL_PLAN).toBe('growth')
          expect(limitsFor({ status: 'trial' })).toEqual({ outlets: 3, tables: 60, staff: 25 })
     })

     it('bigger plans never allow less', () => {
          const order = [PLAN_LIMITS.starter!, PLAN_LIMITS.growth!, PLAN_LIMITS.premium!]
          for (let i = 1; i < order.length; i++) {
               expect(order[i]!.tables).toBeGreaterThan(order[i - 1]!.tables)
               expect(order[i]!.outlets).toBeGreaterThan(order[i - 1]!.outlets)
          }
     })
})
