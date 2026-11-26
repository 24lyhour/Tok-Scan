import type { ReactNode } from 'react'

/** Page frame: sidebar column + (top bar, content). Shared by the restaurant app and the console. */
export function ShellLayout({
     sidebar,
     topbar,
     children,
}: {
     sidebar: ReactNode
     topbar: ReactNode
     children: ReactNode
}) {
     return (
          <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
               {sidebar}
               <div className="flex min-w-0 flex-col">
                    {topbar}
                    <main id="main" className="flex-1 p-4 sm:p-6">
                         {children}
                    </main>
               </div>
          </div>
     )
}

/** Round initials avatar for the user card at the bottom of the sidebar. */
export function initials(name: string) {
     const parts = name
          .replace(/@.*/, '')
          .split(/[\s._-]+/)
          .filter(Boolean)
     return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'T'
}
