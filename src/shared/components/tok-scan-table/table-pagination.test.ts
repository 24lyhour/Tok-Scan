import { describe, expect, it } from 'vitest'

import { visiblePages } from './table-pagination'

describe('visiblePages', () => {
     it('shows first, last and the pages around the current one', () => {
          expect(visiblePages(5, 21)).toEqual([1, 4, 5, 6, 21])
          expect(visiblePages(1, 3)).toEqual([1, 2, 3])
          expect(visiblePages(1, 1)).toEqual([1])
     })
})
