import { describe, expect, it } from 'vitest'

import { safeNextPath } from './routes'

describe('safeNextPath (open-redirect protection)', () => {
     it.each([
          ['/onboarding/tables', '/onboarding/tables'],
          ['https://evil.example', '/fallback'],
          ['//evil.example', '/fallback'],
          ['/\\evil.example', '/fallback'],
          ['/login', '/fallback'],
          ['/signup?x=1', '/fallback'],
          [undefined, '/fallback'],
     ])('%s → %s', (raw, expected) => {
          expect(safeNextPath(raw, '/fallback')).toBe(expected)
     })
})
