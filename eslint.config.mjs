import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
     ...nextVitals,
     ...nextTs,
     {
          rules: {
               '@typescript-eslint/ban-ts-comment': 'warn',
               '@typescript-eslint/no-empty-object-type': 'warn',
               '@typescript-eslint/no-explicit-any': 'warn',
               '@typescript-eslint/no-unused-vars': [
                    'warn',
                    {
                         vars: 'all',
                         args: 'after-used',
                         ignoreRestSiblings: false,
                         argsIgnorePattern: '^_',
                         varsIgnorePattern: '^_',
                         destructuredArrayIgnorePattern: '^_',
                         caughtErrorsIgnorePattern: '^(_|ignore)',
                    },
               ],
          },
     },
     /* ── Architecture rules (docs/ARCHITECTURE.md) ── */
     {
          files: ['src/**/*.{ts,tsx}'],
          rules: {
               'no-restricted-imports': [
                    'error',
                    {
                         patterns: [
                              {
                                   // Allowed: @/modules/<module> (public), @/modules/<module>/payload (backend:
                                   // collections, access rules)
                                   regex: '^@/modules/[^/]+/(?!payload$).+',
                                   message: 'Import another module through an entry point: @/modules/<module> (public) or @/modules/<module>/payload (backend). Inside a module, use relative imports.',
                              },
                         ],
                    },
               ],
          },
     },
     {
          files: ['src/shared/**/*.{ts,tsx}'],
          rules: {
               'no-restricted-imports': [
                    'error',
                    {
                         patterns: [
                              {
                                   group: ['@/modules', '@/modules/**'],
                                   message: 'src/shared must not depend on product modules.',
                              },
                         ],
                    },
               ],
          },
     },
     globalIgnores([
          '.next/**',
          'node_modules/**',
          'playwright-report/**',
          'test-results/**',
          'src/payload-types.ts',
          'src/payload-generated-schema.ts',
          'src/app/(payload)/**',
          'src/migrations/**',
     ]),
])
