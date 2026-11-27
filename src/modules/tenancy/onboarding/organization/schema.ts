/** Step 2 · Organization — Zod schema shared by the form and the server action (guide p.23). */
import { z } from 'zod'

import { optionalText, requiredText, switchField, type SchemaField } from '@/shared/lib/validation'

import {
     BRAND_COLOR_VALUES,
     BUSINESS_TYPES,
     type BusinessType,
     DEFAULT_BRAND_COLOR,
     ORGANIZATION_LIMITS,
} from '../../collections/organizations/constants'
import { checkSlugFormat, slugify } from '../../collections/organizations/slug'
import { slugProblemToError } from '../errors'

export const LOGO_MAX_BYTES = 2 * 1024 * 1024
export const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'] as const

/** Menu web address: normalised with slugify, then checked (length, characters, reserved words). */
export const slugField = z
     .string('required')
     .trim()
     .min(1, 'required')
     .transform((raw, ctx) => {
          const slug = slugify(raw)
          const problem = checkSlugFormat(slug)
          if (problem)
               ctx.issues.push({ code: 'custom', message: slugProblemToError[problem], input: raw })
          return slug
     })

/** Optional logo upload. An empty file input posts an empty File → treated as "no logo". */
const logoField = z.preprocess(
     (v) => (v instanceof File && v.size > 0 ? v : undefined),
     z
          .file()
          .max(LOGO_MAX_BYTES, 'logoSize')
          .mime([...LOGO_TYPES], 'logoType')
          .optional(),
)

/**
 * Name, web address and business type — the same rules here and in the super-admin console's
 * "Edit organization". Use with `requireOtherType` + `dropStaleOtherType`.
 */
export const organizationCoreFields = {
     name: requiredText(ORGANIZATION_LIMITS.name),
     slug: slugField,
     businessType: z.enum(BUSINESS_TYPES, 'required'),
     /** The owner's own business type — only when businessType is 'other' */
     businessTypeOther: optionalText(ORGANIZATION_LIMITS.businessTypeOther),
}

type WithBusinessType = { businessType: BusinessType; businessTypeOther: string }

/** 'Other' needs the owner's own words. */
export function requireOtherType(org: WithBusinessType, ctx: z.RefinementCtx) {
     if (org.businessType === 'other' && !org.businessTypeOther) {
          ctx.addIssue({ code: 'custom', message: 'required', path: ['businessTypeOther'] })
     }
}

/** Keep the free text only for 'other', so a stale value is never saved. */
export function dropStaleOtherType<T extends WithBusinessType>(org: T): T {
     return { ...org, businessTypeOther: org.businessType === 'other' ? org.businessTypeOther : '' }
}

export const organizationSchema = z
     .object({
          ...organizationCoreFields,
          logo: logoField,
          removeLogo: switchField(),
          brandColor: z.enum(BRAND_COLOR_VALUES).catch(DEFAULT_BRAND_COLOR),
     })
     .superRefine(requireOtherType)
     .transform(dropStaleOtherType)

export type OrganizationField = SchemaField<typeof organizationSchema>
