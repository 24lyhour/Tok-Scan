import { describe, expect, it } from 'vitest'

import { formValues } from '@/shared/lib/validation'

import { validate } from '../errors'
import { OUTLET_LIST_FIELDS, outletSchema } from './schema'

const form = (entries: [string, string][]) => {
     const data = new FormData()
     for (const [k, v] of entries) data.append(k, v)
     return formValues(data, OUTLET_LIST_FIELDS)
}
const valid: [string, string][] = [
     ['name', 'BKK1'],
     ['exchangeRate', '4,100'],
     ['vatEnabled', 'on'],
     ['vatPercent', '10'],
     ['serviceChargeEnabled', 'off'],
     ['serviceChargePercent', '5'],
     ['lightingTaxPercent', '3'],
     ['days', 'mon'],
     ['days', 'fri'],
     ['opens', '10:00'],
     ['closes', '22:00'],
]

describe('outletSchema', () => {
     it('parses a posted form', () => {
          expect(validate(outletSchema, form(valid))).toEqual({
               ok: true,
               data: {
                    name: 'BKK1',
                    address: '',
                    exchangeRate: 4100,
                    vatEnabled: true,
                    vatPercent: 10,
                    serviceChargeEnabled: false,
                    serviceChargePercent: 5,
                    lightingTaxEnabled: false,
                    lightingTaxPercent: 3,
                    vatTin: '',
                    days: ['mon', 'fri'],
                    opens: '10:00',
                    closes: '22:00',
               },
          })
     })

     it('reports rate, percent, days and time problems', () => {
          const bad = valid
               .filter(([k]) => k !== 'days')
               .map(([k, v]): [string, string] =>
                    k === 'exchangeRate'
                         ? [k, 'abc']
                         : k === 'vatPercent'
                           ? [k, '150']
                           : k === 'opens'
                             ? [k, '25:00']
                             : [k, v],
               )
          expect(validate(outletSchema, form(bad))).toEqual({
               ok: false,
               fieldErrors: {
                    exchangeRate: 'number',
                    vatPercent: 'percent',
                    days: 'days',
                    opens: 'time',
               },
          })
     })
})
