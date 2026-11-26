import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

/**
 * Two test projects:
 *   unit — next to the code (src/**\/*.test.ts): pure logic, no database. Fast.
 *   int  — tests/int/**: real Payload + Postgres (access rules, hooks). Needs DATABASE_URL.
 */
export default defineConfig({
     plugins: [tsconfigPaths(), react()],
     test: {
          projects: [
               {
                    extends: true,
                    test: {
                         name: 'unit',
                         environment: 'node',
                         include: ['src/**/*.test.{ts,tsx}'],
                    },
               },
               {
                    extends: true,
                    test: {
                         name: 'int',
                         environment: 'node',
                         setupFiles: ['./vitest.setup.ts'],
                         include: ['tests/int/**/*.int.spec.ts'],
                         testTimeout: 60_000,
                         hookTimeout: 120_000,
                         // One database: run files one after another
                         fileParallelism: false,
                    },
               },
          ],
     },
})
