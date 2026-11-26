import type { CollectionConfig } from 'payload'

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
     ],
}
