import type { ReactNode } from 'react'

import { COLORS } from '@/shared/config/colors'

/**
 * Brand colours for the Payload admin (Payload `admin.components.providers`). Tailwind isn't loaded
 * there, so this exposes the tokens as CSS variables (--tok-*) from the one shared COLORS list;
 * src/app/(payload)/custom.scss uses them for buttons and the login page.
 */
const vars = Object.entries(COLORS)
     .map(([token, hex]) => `--tok-${token}:${hex};`)
     .join('')

export function AdminTheme({ children }: { children?: ReactNode }) {
     return (
          <>
               <style>{`:root{${vars}}`}</style>
               {children}
          </>
     )
}
