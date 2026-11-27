'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/modules/tenancy'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'
import { exists, isUniqueError, relationId } from '@/shared/lib/payload'
import { formValues } from '@/shared/lib/validation'

import { orgEditSchema, type OrgEditState, trialEndsAtToISO, validateOrgEdit } from './schema'

/**
 * Save the console's Edit organization form: the organization (name, web address, type, trial
 * end) and its owner (name, email). Super-admin only; runs AS the signed-in staff member, so
 * Payload's access rules and hooks apply. Back to the organization's panel when saved.
 */
export async function updateOrganization(
     _prev: OrgEditState,
     formData: FormData,
): Promise<OrgEditState> {
     const { payload, staff } = await getCurrentUser()
     if (!staff) return { status: 'error', formError: 'generic' }

     const id = Number(formData.get('id'))
     const result = validateOrgEdit(orgEditSchema, formValues(formData))
     if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }
     const data = result.data

     const org = Number.isInteger(id)
          ? await payload
                 .findByID({ collection: 'organizations', id, depth: 0, overrideAccess: true })
                 .catch(() => null)
          : null
     if (!org) return { status: 'error', formError: 'generic' }
     const ownerId = relationId(org.owner)

     const [slugTaken, emailTaken] = await Promise.all([
          exists(payload, 'organizations', {
               and: [{ slug: { equals: data.slug } }, { id: { not_equals: id } }],
          }),
          ownerId
               ? exists(payload, 'users', {
                      and: [
                           { email: { equals: data.ownerEmail } },
                           { id: { not_equals: ownerId } },
                      ],
                 })
               : false,
     ])
     if (slugTaken || emailTaken) {
          return {
               status: 'error',
               fieldErrors: {
                    ...(slugTaken ? { slug: 'slugTaken' as const } : {}),
                    ...(emailTaken ? { ownerEmail: 'emailTaken' as const } : {}),
               },
          }
     }

     try {
          await payload.update({
               collection: 'organizations',
               id,
               data: {
                    name: data.name,
                    slug: data.slug,
                    businessType: data.businessType,
                    businessTypeOther: data.businessTypeOther,
                    trialEndsAt: trialEndsAtToISO(data.trialEndsAt),
               },
               user: staff,
               overrideAccess: false,
          })
          if (ownerId) {
               await payload.update({
                    collection: 'users',
                    id: ownerId,
                    data: { name: data.ownerName, email: data.ownerEmail },
                    user: staff,
                    overrideAccess: false,
               })
          }
     } catch (error) {
          // Two saves racing for the same address / email
          if (isUniqueError(error, 'slug')) {
               return { status: 'error', fieldErrors: { slug: 'slugTaken' } }
          }
          if (isUniqueError(error, 'email')) {
               return { status: 'error', fieldErrors: { ownerEmail: 'emailTaken' } }
          }
          payload.logger.error({ err: error, msg: 'Console: saving the organization failed' })
          return { status: 'error', formError: 'generic' }
     }

     revalidatePath(CONSOLE_ROUTES.home, 'layout')
     redirect(`${CONSOLE_ROUTES.organizations}?org=${id}`)
}
