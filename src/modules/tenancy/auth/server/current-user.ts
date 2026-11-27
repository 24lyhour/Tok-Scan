import 'server-only'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import { ADMINS_SLUG } from '@/modules/core/payload'
import type { Admin, User } from '@/payload-types'

/**
 * Payload + who is signed in for this request — two separate tables, never mixed:
 * - `user`:  a restaurant owner / their staff (`users`) — the owner app
 * - `staff`: tok-scan staff (`admins`) — the console
 * At most one is set. Cached, so pages, layouts and actions can all call it and the auth check
 * still runs once per request.
 */
export const getCurrentUser = cache(async () => {
     const payload = await getPayload({ config })
     const { user } = await payload.auth({ headers: await headers() })
     const isStaff = user?.collection === ADMINS_SLUG
     return {
          payload,
          user: user && !isStaff ? (user as User) : null,
          staff: isStaff ? (user as Admin) : null,
     }
})
