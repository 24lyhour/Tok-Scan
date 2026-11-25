/**
 * Core — platform-wide building blocks shared by every module (uploads, languages, audit log later).
 */
import type { CollectionConfig } from 'payload'

import { Media } from './media/collection'

export const coreCollections: CollectionConfig[] = [Media]

export { Media }
export { adminI18n, localization } from './i18n'
