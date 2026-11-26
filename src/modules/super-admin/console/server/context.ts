import 'server-only'

import { redirect } from 'next/navigation'
import { cache } from 'react'

import { isSuperAdmin } from '@/modules/core/payload'
import { authRoutes, getCurrentUser } from '@/modules/tenancy'
import { APP_ROUTES, CONSOLE_ROUTES } from '@/shared/config/app-routes'

/**
 * Every console page and action starts here: tok-scan staff (super-admin) only.
 * Signed out → login (then back to the console); restaurant users → their own app.
 * Cached per request.
 */
export const getConsoleContext = cache(async () => {
     const { payload, user } = await getCurrentUser()
     if (!user) redirect(`${authRoutes.login}?next=${encodeURIComponent(CONSOLE_ROUTES.home)}`)
     if (!isSuperAdmin(user)) redirect(APP_ROUTES.dashboard)

     const { totalDocs: pendingCount } = await payload.count({
          collection: 'organizations',
          where: { status: { equals: 'pending_approval' } },
          overrideAccess: true,
     })
     return { payload, user, pendingCount }
})

export type ConsoleContext = Awaited<ReturnType<typeof getConsoleContext>>
