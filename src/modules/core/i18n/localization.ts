import type { LocalizationConfig } from 'payload'

import { defaultLocale, locales } from './locales'

/**
 * Payload content localization — fields marked `localized: true` store one value per locale.
 * https://payloadcms.com/docs/configuration/localization
 *
 * Postgres note: localized fields live in `<collection>_locales` tables, so turning
 * `localized` on/off for an existing field needs a migration.
 */
export const localization: LocalizationConfig = {
     locales: locales.map((l) => ({
          code: l.code,
          // Label shown in the admin locale switcher, per admin UI language
          label: { en: `${l.label} (${l.nativeLabel})`, zh: l.nativeLabel },
     })),
     defaultLocale,
     // Missing Khmer/Chinese values fall back to English instead of showing empty
     fallback: true,
     // TODO(module 14): only offer the locales the active organization has enabled
     // (organizations.languages), using filterAvailableLocales({ locales, req }).
}
