import type { CollectionConfig } from 'payload'

import {
     ADMIN_GROUPS,
     nobody,
     orgManagersUpdate,
     orgMembersRead,
     ADMINS_SLUG,
     superAdminOnly,
} from '@/modules/core/payload'
import {
     BUSINESS_TYPES,
     DEFAULT_BRAND_COLOR,
     ONBOARDING_STEPS,
     ORG_STATUSES,
     ORGANIZATION_LIMITS,
} from './constants'
import { trackStatusChange } from './hooks/track-status-change'
import { checkSlugFormat, slugify } from './slug'

/**
 * Organizations — the Payload multi-tenant "tenant": one restaurant business (Module 14 §3.1).
 * Created by onboarding (server action, overrideAccess); never hard-deleted.
 */
export const Organizations: CollectionConfig = {
     slug: 'organizations',
     admin: {
          useAsTitle: 'name',
          // Super-admin console: who signed up, their state, when
          defaultColumns: ['name', 'slug', 'status', 'owner', 'trialEndsAt', 'createdAt'],
          listSearchableFields: ['name', 'slug', 'code'],
          group: ADMIN_GROUPS.platform,
     },
     hooks: { beforeChange: [trackStatusChange] },
     access: {
          read: orgMembersRead,
          // Created by the onboarding action (server code); never deleted — closed instead
          create: superAdminOnly,
          update: orgManagersUpdate,
          delete: nobody,
     },
     fields: [
          { name: 'name', type: 'text', required: true, maxLength: ORGANIZATION_LIMITS.name },
          {
               name: 'slug',
               type: 'text',
               required: true,
               unique: true,
               index: true,
               admin: { description: 'Menu web address: tok-scan.store/r/<slug>' },
               hooks: {
                    beforeValidate: [
                         ({ value }) => (typeof value === 'string' ? slugify(value) : value),
                    ],
               },
               validate: (value: unknown) => {
                    const problem = checkSlugFormat(String(value ?? ''))
                    return problem ? `Invalid web address (${problem})` : true
               },
          },
          {
               name: 'code',
               type: 'text',
               required: true,
               unique: true,
               maxLength: ORGANIZATION_LIMITS.code,
               admin: { description: 'Short code used in invoice and order numbers, e.g. MHB' },
          },
          { name: 'logo', type: 'upload', relationTo: 'media' },
          {
               name: 'brand',
               type: 'group',
               fields: [{ name: 'primaryColor', type: 'text', defaultValue: DEFAULT_BRAND_COLOR }],
          },
          {
               name: 'businessType',
               type: 'select',
               defaultValue: 'restaurant',
               options: [...BUSINESS_TYPES],
          },
          {
               // The owner's own words when businessType = 'other', e.g. "Bakery", "Karaoke"
               name: 'businessTypeOther',
               type: 'text',
               maxLength: ORGANIZATION_LIMITS.businessTypeOther,
               admin: { condition: (data) => data?.businessType === 'other' },
          },
          {
               name: 'status',
               type: 'select',
               defaultValue: 'trial',
               options: [...ORG_STATUSES],
               access: { update: superAdminOnly },
               admin: {
                    position: 'sidebar',
                    description:
                         'Approve: pending approval → active. Only tok-scan staff can change it.',
               },
          },
          {
               name: 'statusChangedAt',
               type: 'date',
               // Written by trackStatusChange when a super-admin changes the status
               access: { update: superAdminOnly },
               admin: { position: 'sidebar', readOnly: true },
          },
          {
               name: 'statusChangedBy',
               type: 'relationship',
               // tok-scan staff (only they approve / suspend)
               relationTo: ADMINS_SLUG,
               // Written by trackStatusChange when a super-admin changes the status
               access: { update: superAdminOnly },
               admin: { position: 'sidebar', readOnly: true },
          },
          {
               name: 'trialEndsAt',
               type: 'date',
               // Set by onboarding; only tok-scan staff may change it (owners can't extend their trial)
               access: { update: superAdminOnly },
               admin: { position: 'sidebar' },
          },
          {
               name: 'onboarding',
               type: 'group',
               admin: { position: 'sidebar' },
               fields: [
                    {
                         name: 'step',
                         type: 'select',
                         defaultValue: 'outlet',
                         options: [...ONBOARDING_STEPS],
                    },
                    { name: 'completedAt', type: 'date' },
               ],
          },
          { name: 'owner', type: 'relationship', relationTo: 'users', required: true },
     ],
}
