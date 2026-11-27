import 'server-only'

import { redirect } from 'next/navigation'
import { cache } from 'react'

import { getCurrentUser } from '@/modules/tenancy'
import { APP_ROUTES, CONSOLE_ROUTES } from '@/shared/config/app-routes'

/**
 * Every console page starts here: tok-scan staff (the `admins` table) only.
 * Signed out → the staff login; a restaurant owner → their own app.
 * Cached per request.
 */
export const getConsoleContext = cache(async () => {
     const { payload, user, staff } = await getCurrentUser()
     // Staff accounts only (the `admins` table). An owner signed in → their own app.
     if (!staff) redirect(user ? APP_ROUTES.dashboard : CONSOLE_ROUTES.login)

     const { totalDocs: pendingCount } = await payload.count({
          collection: 'organizations',
          where: { status: { equals: 'pending_approval' } },
          overrideAccess: true,
     })
     return { payload, staff, pendingCount }
})

export type ConsoleContext = Awaited<ReturnType<typeof getConsoleContext>>
