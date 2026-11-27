/**
 * Brand colours as plain hex, for the few places Tailwind/CSS can't reach: the web manifest,
 * <meta name="theme-color">, SVGs inside the Payload admin, QR codes, emails.
 *
 * The source of truth is `src/app/(frontend)/styles.css` (@theme). Keys are the token names
 * (`--color-<key>`); colors.test.ts fails if a value here drifts from styles.css.
 * Everywhere else, use the Tailwind classes (bg-brand-700, text-ink, shadow-popover …).
 */
export const COLORS = {
     'brand-700': '#14513f',
     'brand-900': '#0b2e24',
     'saffron-500': '#e09f3e',
     ink: '#16181d',
     'ink-2': '#4a505c',
     'ink-3': '#8a909c',
     line: '#e8e4dc',
     paper: '#faf8f4',
} as const

export type ColorToken = keyof typeof COLORS
