'use server'

import { redirect } from 'next/navigation'
import type { Payload, Where } from 'payload'

import { formValues } from '@/shared/lib/validation'

import {
     baseOrgCode,
     checkSlugFormat,
     slugCandidates,
     slugify,
     type SlugProblem,
} from '../../collections/organizations/slug'
import { exists, isUniqueError, relationId } from '@/shared/lib/payload'
import { type StepState, validate } from '../errors'
import { STEP_PATHS } from '../routes'
import { getOnboardingContext } from '../server/context'
import { type OrganizationField, organizationSchema } from './schema'

// Not exported: a 'use server' file may only export async functions.
const TRIAL_DAYS = 14

export type SlugCheck = {
     slug: string
     problem: SlugProblem | null
     /** Free alternatives when the address can't be used (max 3) */
     suggestions: string[]
}

/** Live "Available ✓" check for the web address, with free alternatives. Signed-in owners only. */
export async function checkSlugAvailability(
     raw: string,
     businessType?: string,
): Promise<SlugCheck> {
     const { payload, organization } = await getOnboardingContext()
     const slug = slugify(raw)
     const notMine: Where = organization ? { id: { not_equals: organization.id } } : {}

     const problem =
          checkSlugFormat(slug) ??
          ((await exists(payload, 'organizations', { slug: { equals: slug }, ...notMine }))
               ? 'taken'
               : null)
     if (!problem) return { slug, problem, suggestions: [] }

     // One query for all candidates, keep the free ones
     const candidates = slugCandidates(slug, businessType)
     const used = candidates.length
          ? await payload.find({
                 collection: 'organizations',
                 where: { slug: { in: candidates }, ...notMine },
                 select: { slug: true },
                 pagination: false,
                 depth: 0,
                 overrideAccess: true,
            })
          : { docs: [] }
     const usedSlugs = new Set(used.docs.map((d) => d.slug))
     return { slug, problem, suggestions: candidates.filter((c) => !usedSlugs.has(c)).slice(0, 3) }
}

/** Step 2 — create (or edit) the owner's organization, then continue to the outlet step. */
export async function saveOrganization(
     _prev: StepState<OrganizationField>,
     formData: FormData,
): Promise<StepState<OrganizationField>> {
     const ctx = await getOnboardingContext()
     const { payload, user } = ctx

     const result = validate(organizationSchema, formValues(formData))
     if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }
     const { name, slug, brandColor, businessType, businessTypeOther, logo, removeLogo } =
          result.data

     if ((await checkSlugAvailability(slug)).problem === 'taken') {
          return { status: 'error', fieldErrors: { slug: 'slugTaken' } }
     }

     try {
          const data = {
               name,
               slug,
               businessType,
               businessTypeOther,
               brand: { primaryColor: brandColor },
               ...(removeLogo ? { logo: null } : {}),
          }

          let orgId: number
          if (ctx.organization) {
               orgId = ctx.organization.id
               await payload.update({
                    collection: 'organizations',
                    id: orgId,
                    data,
                    overrideAccess: true,
               })
          } else {
               const organization = await payload.create({
                    collection: 'organizations',
                    data: {
                         ...data,
                         code: await uniqueOrgCode(payload, name),
                         owner: user.id,
                         status: 'trial',
                         trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 86_400_000).toISOString(),
                         onboarding: { step: 'outlet' },
                    },
                    overrideAccess: true,
               })
               orgId = organization.id
               // The creator becomes the organization's owner (users.tenants[] from the multi-tenant plugin)
               await payload.update({
                    collection: 'users',
                    id: user.id,
                    data: {
                         tenants: [
                              ...(user.tenants ?? []).map((t) => ({
                                   tenant: relationId(t.tenant)!,
                                   orgRole: t.orgRole,
                              })),
                              { tenant: organization.id, orgRole: 'owner' as const },
                         ],
                    },
                    overrideAccess: true,
               })
          }

          // Logo last: media belongs to the organization, so the organization must exist first
          const logoId = logo ? await uploadLogo(payload, logo, name, orgId) : undefined
          if (logoId) {
               await payload.update({
                    collection: 'organizations',
                    id: orgId,
                    data: { logo: logoId },
                    overrideAccess: true,
               })
          }
     } catch (error) {
          if (isUniqueError(error, 'slug'))
               return { status: 'error', fieldErrors: { slug: 'slugTaken' } }
          payload.logger.error({ err: error, msg: '[onboarding] saveOrganization failed' })
          return { status: 'error', formError: 'generic' }
     }

     redirect(STEP_PATHS.outlet)
}

/** Upload to Media. If storage isn't set up (e.g. no Vercel Blob token), continue without a logo. */
async function uploadLogo(payload: Payload, file: File, orgName: string, orgId: number) {
     try {
          const media = await payload.create({
               collection: 'media',
               data: { alt: `${orgName} logo`, tenant: orgId },
               file: {
                    data: Buffer.from(await file.arrayBuffer()),
                    mimetype: file.type,
                    name: file.name || 'logo',
                    size: file.size,
               },
               overrideAccess: true,
          })
          return media.id
     } catch (error) {
          payload.logger.error({ err: error, msg: '[onboarding] logo upload failed — continuing' })
          return undefined
     }
}

/** MHB, then MHB2, MHB3 … if taken. */
async function uniqueOrgCode(payload: Payload, name: string) {
     const base = baseOrgCode(name)
     for (let i = 1; i <= 50; i++) {
          const code = i === 1 ? base : `${base}${i}`
          if (!(await exists(payload, 'organizations', { code: { equals: code } }))) return code
     }
     return `${base}${Date.now().toString(36).slice(-3).toUpperCase()}`
}
