import type { ReactNode } from 'react'

import { COLORS } from '@/shared/config/colors'

/**
 * Brand colours inside the Payload admin (Payload `admin.components.providers`). Tailwind isn't
 * loaded there, so this defines the same CSS variables Tailwind defines in the app
 * (`--color-brand-700` …) from the one shared COLORS list. That way every super-admin component's
 * CSS works the same in the admin and in the app.
 */
const vars = Object.entries(COLORS)
     .map(([token, hex]) => `--color-${token}:${hex};`)
     .join('')

export function AdminTheme({ children }: { children?: ReactNode }) {
     return (
          <>
               <style>{`:root{${vars}}`}</style>
               {children}
          </>
     )
}
