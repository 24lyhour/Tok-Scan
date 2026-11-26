import 'server-only'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { User } from '@/payload-types'

/**
 * Payload + the signed-in user for this request. Cached, so pages, layouts and actions can all
 * call it and the auth check still runs once per request.
 */
export const getCurrentUser = cache(async () => {
     const payload = await getPayload({ config })
     const { user } = await payload.auth({ headers: await headers() })
     return { payload, user: (user as User | null) ?? null }
})
