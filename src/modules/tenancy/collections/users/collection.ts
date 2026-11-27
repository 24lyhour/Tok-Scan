import type { CollectionConfig } from 'payload'

import {
     ADMIN_GROUPS,
     requireCaptchaOnApiLogin,
     selfOrSuperAdmin,
     superAdminOnly,
     usersRead,
} from '@/modules/core/payload'

import { brandedForgotPassword } from '../../auth/password-reset/email'
import { membershipsField } from '../../plugin'

/**
 * Users — restaurant owners and their staff: one login per person, who can belong to many
 * organizations (Module 14 §3.3). tok-scan's own staff are NOT here: they have their own table,
 * `admins` (super-admin module). Self sign-up goes through the onboarding server action.
 */
export const Users: CollectionConfig = {
     slug: 'users',
     admin: {
          group: ADMIN_GROUPS.platform,
          useAsTitle: 'email',
          defaultColumns: ['name', 'email', 'phone', 'createdAt'],
     },
     // Branded reset email (tok-scan logo, button → /reset-password), in the reader's language
     auth: { forgotPassword: brandedForgotPassword() },
     access: {
          read: usersRead,
          // Sign-up and invitations create users in server actions; the API can't
          create: superAdminOnly,
          update: selfOrSuperAdmin,
          delete: superAdminOnly,
     },
     hooks: {
          // Anyone calling /api/users/login must pass the bot check
          beforeOperation: [requireCaptchaOnApiLogin],
     },
     fields: [
          // email + password are added by `auth: true`
          {
               name: 'name',
               type: 'text',
               maxLength: 80,
               // Required by the sign-up form; not enforced in the DB so existing rows stay valid.
          },
          {
               name: 'phone',
               type: 'text',
               admin: {
                    description: 'E.164 format, e.g. +85512345678 — used for Telegram verification',
               },
          },
          {
               // Google account id (OIDC `sub`) — set by "Continue with Google", never changes.
               // Hidden: not returned by the API or shown in the admin.
               name: 'googleSub',
               type: 'text',
               unique: true,
               index: true,
               hidden: true,
          },
          {
               name: 'acceptedTermsAt',
               type: 'date',
               admin: { readOnly: true, position: 'sidebar' },
          },
          membershipsField(),
     ],
}
