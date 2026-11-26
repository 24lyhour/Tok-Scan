import type { I18nClient } from '@payloadcms/translations'

import { ConsoleBanner } from '@/shared/components/super-admin'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

import { tr } from './translations'

/** Payload `beforeDashboard`: the data admin's home sends staff to the real console. */
export function ConsoleLink({ i18n }: { i18n: I18nClient }) {
     return (
          <ConsoleBanner
               title={tr(i18n.t, 'console')}
               body={tr(i18n.t, 'subtitle')}
               href={CONSOLE_ROUTES.organizations}
               action={tr(i18n.t, 'openConsole')}
          />
     )
}
