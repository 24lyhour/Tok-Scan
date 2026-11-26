import { describe, expect, it } from 'vitest'

import { limitsFor, PLAN_LIMITS, TRIAL_LIMITS } from './plans'

describe('plans', () => {
     it('the free trial is 1 outlet and 5 tables', () => {
          expect(TRIAL_LIMITS).toEqual({ outlets: 1, tables: 5, staff: 3 })
          expect(limitsFor({ status: 'trial' })).toEqual(TRIAL_LIMITS)
     })

     it('the trial never allows more than the smallest paid plan', () => {
          const starter = PLAN_LIMITS.starter!
          expect(TRIAL_LIMITS.tables).toBeLessThanOrEqual(starter.tables)
          expect(TRIAL_LIMITS.outlets).toBeLessThanOrEqual(starter.outlets)
     })

     it('bigger plans never allow less', () => {
          const order = [PLAN_LIMITS.starter!, PLAN_LIMITS.growth!, PLAN_LIMITS.premium!]
          for (let i = 1; i < order.length; i++) {
               expect(order[i]!.tables).toBeGreaterThan(order[i - 1]!.tables)
               expect(order[i]!.outlets).toBeGreaterThan(order[i - 1]!.outlets)
          }
     })
})
