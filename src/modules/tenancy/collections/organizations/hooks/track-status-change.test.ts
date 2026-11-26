import { describe, expect, it } from 'vitest'

import { trackStatusChange } from './track-status-change'

type Args = Parameters<typeof trackStatusChange>[0]
const run = (args: Partial<Args> & { data: Record<string, unknown> }) =>
     trackStatusChange({
          operation: 'update',
          req: { user: { id: 7 } },
          ...args,
     } as unknown as Args)

describe('trackStatusChange (approve / suspend audit)', () => {
     it('records who changed the status and when', () => {
          const out = run({
               data: { status: 'active' },
               originalDoc: { status: 'pending_approval' },
          })
          expect(out.statusChangedBy).toBe(7)
          expect(new Date(out.statusChangedAt).getTime()).toBeGreaterThan(Date.now() - 5000)
     })

     it('leaves other edits alone', () => {
          expect(run({ data: { name: 'x' }, originalDoc: { status: 'active' } })).toEqual({
               name: 'x',
          })
          expect(run({ data: { status: 'active' }, originalDoc: { status: 'active' } })).toEqual({
               status: 'active',
          })
     })

     it('does nothing when an organization is created', () => {
          expect(run({ operation: 'create', data: { status: 'trial' } } as never)).toEqual({
               status: 'trial',
          })
     })
})
