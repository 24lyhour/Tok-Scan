import type { CollectionConfig } from 'payload'

import {
     ADMIN_GROUPS,
     ADMINS_SLUG,
     requireCaptchaOnApiLogin,
     superAdminOnly,
} from '@/modules/core/payload'
import { brandedForgotPassword } from '@/modules/tenancy/payload'

/**
 * Admins — tok-scan's own staff (super-admins), in their OWN table: separate from restaurant
 * owners (`users`). They log in at /admin/login, use /console and Payload's data admin, and can
 * see every organization (core/access.ts `isSuperAdmin`). They belong to no organization.
 * Only staff can create or change staff accounts; the first one comes from `yarn seed:admin`.
 */
export const Admins: CollectionConfig = {
     slug: ADMINS_SLUG,
     admin: {
          group: ADMIN_GROUPS.platform,
          useAsTitle: 'email',
          defaultColumns: ['name', 'email', 'createdAt'],
     },
     // Branded reset email; its link opens the staff reset (then back to /console)
     auth: { forgotPassword: brandedForgotPassword({ staff: true }) },
     access: {
          // Payload's data admin (/admin/collections/…) is for tok-scan staff only
          admin: superAdminOnly,
          read: superAdminOnly,
          create: superAdminOnly,
          update: superAdminOnly,
          delete: superAdminOnly,
     },
     hooks: {
          // Anyone calling /api/admins/login must pass the bot check
          beforeOperation: [requireCaptchaOnApiLogin],
     },
     fields: [
          // email + password are added by `auth: true`
          { name: 'name', type: 'text', maxLength: 80 },
     ],
}
