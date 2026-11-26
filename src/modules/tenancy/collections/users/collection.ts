import type { CollectionConfig } from 'payload'

import { selfOrSuperAdmin, superAdminOnly, usersRead } from '@/modules/core/payload'

/**
 * Users — one login per person; a person can belong to many organizations (Module 14 §3.3).
 * Self sign-up goes through the onboarding server action (tenancy/onboarding), not public REST create.
 */
export const Users: CollectionConfig = {
     slug: 'users',
     admin: {
          useAsTitle: 'email',
          defaultColumns: ['name', 'email', 'phone', 'createdAt'],
     },
     auth: true,
     access: {
          read: usersRead,
          // Sign-up and invitations create users in server actions; the API can't
          create: superAdminOnly,
          update: selfOrSuperAdmin,
          delete: superAdminOnly,
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
               // tok-scan staff only. Only a super-admin can grant it.
               name: 'platformRole',
               type: 'select',
               defaultValue: 'none',
               options: [
                    { label: 'None', value: 'none' },
                    { label: 'Super-admin (tok-scan staff)', value: 'super-admin' },
               ],
               access: { create: superAdminOnly, update: superAdminOnly },
               admin: { position: 'sidebar' },
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
     ],
}
