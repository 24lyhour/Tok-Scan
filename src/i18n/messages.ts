/**
 * Global message catalog — every translated namespace, for every site locale (en · km · zh).
 *
 * To add a namespace: create `content.ts` in your module exporting `Translations<YourContent>`,
 * then register it below. Import the content file directly (not the module index) to avoid cycles.
 */
import { landingContent } from '@/modules/marketing/landing/content'
import { authContent } from '@/modules/tenancy/auth/content'
import { onboardingContent } from '@/modules/tenancy/onboarding/content'
import type { SiteLocale } from '@/shared/i18n/site-locale'

import { commonMessages } from './common'

const catalog = {
     common: commonMessages,
     landing: landingContent,
     onboarding: onboardingContent,
     auth: authContent,
}

type Catalog = typeof catalog
export type Namespace = keyof Catalog
export type Messages = { [N in Namespace]: Catalog[N][SiteLocale] }

/** All namespaces for one locale — what the client provider receives. */
export function getMessages(locale: SiteLocale): Messages {
     return {
          common: catalog.common[locale],
          landing: catalog.landing[locale],
          onboarding: catalog.onboarding[locale],
          auth: catalog.auth[locale],
     }
}
