import { describe, expect, it } from 'vitest'

import { orgListHref, parseOrgQuery, STATUS_ACTIONS } from './query'

describe('parseOrgQuery', () => {
     it('reads a valid URL', () => {
          expect(parseOrgQuery({ status: 'active', q: ' mahob ', page: '2', org: '7' })).toEqual({
               tab: 'active',
               q: 'mahob',
               page: 2,
               org: 7,
          })
     })
     it('falls back safely on bad input', () => {
          expect(parseOrgQuery({ status: 'drop table', page: '-3', org: 'x' })).toEqual({
               tab: 'all',
               q: '',
               page: 1,
               org: null,
          })
     })
     it('keeps the fixed tab of the Approvals page', () => {
          expect(parseOrgQuery({ status: 'active' }, 'pending_approval').tab).toBe(
               'pending_approval',
          )
     })
})

describe('orgListHref', () => {
     const query = parseOrgQuery({ status: 'trial', q: 'kafe' })
     it('changes only what is asked', () => {
          expect(orgListHref('/console/organizations', query, { org: 3 })).toBe(
               '/console/organizations?status=trial&q=kafe&org=3',
          )
     })
     it('drops defaults', () => {
          expect(orgListHref('/c', query, { tab: 'all', q: '', page: 1 })).toBe('/c')
     })
})

describe('STATUS_ACTIONS', () => {
     it('only lets suspended restaurants be reactivated', () => {
          expect(STATUS_ACTIONS.suspended).toEqual(['reactivate'])
          expect(STATUS_ACTIONS.active).not.toContain('approve')
          expect(STATUS_ACTIONS.closed).toEqual([])
     })
})
