import 'server-only'

import { isSuperAdmin } from '@/modules/core/payload'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

import { authRoutes } from '../routes'

/** Where someone lands after signing in: tok-scan staff → console, restaurant owners → their app. */
export function homeAfterSignIn(user: Parameters<typeof isSuperAdmin>[0]): string {
     return isSuperAdmin(user) ? CONSOLE_ROUTES.home : authRoutes.afterLogin
}
