import { redirect } from 'next/navigation'

import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

/** The console opens on Organizations (Overview comes later). */
export default function ConsoleHome() {
     redirect(CONSOLE_ROUTES.organizations)
}
