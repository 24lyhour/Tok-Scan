import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { COLORS } from './colors'

const css = readFileSync(path.resolve(__dirname, '../../app/(frontend)/styles.css'), 'utf8')

describe('COLORS mirrors the design tokens in styles.css', () => {
     it.each(Object.entries(COLORS))('--color-%s is %s', (token, hex) => {
          const match = css.match(new RegExp(`--color-${token}:\\s*(#[0-9a-fA-F]{6});`))
          expect(match?.[1]?.toLowerCase()).toBe(hex)
     })
})
