import { en } from '@payloadcms/translations/languages/en'
import { zh } from '@payloadcms/translations/languages/zh'
import type { I18nOptions } from '@payloadcms/translations'

/**
 * Admin UI language (buttons, menus, validation messages) — separate from content `localization`.
 * https://payloadcms.com/docs/configuration/i18n
 *
 * Khmer is not shipped by @payloadcms/translations (checked 3.94.2), so the admin UI offers
 * English and Chinese. Khmer content is still fully supported via `localization`.
 */
export const adminI18n: I18nOptions = {
     supportedLanguages: { en, zh },
     fallbackLanguage: 'en',
     // tok-scan's own admin texts are added by the registry (src/modules/index.ts) from each
     // module, e.g. the super-admin console (src/modules/platform/admin/translations.ts).
}
