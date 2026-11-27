/**
 * Console · Edit organization — Zod schema shared by the form and the server action.
 * Organization rules come from onboarding (one set of rules); error codes and their en · km · zh
 * texts are onboarding's too.
 */
import { z } from 'zod'

import {
     dropStaleOtherType,
     NAME_MAX,
     type OnboardingErrorCode,
     organizationCoreFields,
     requireOtherType,
} from '@/modules/tenancy/rules'
import {
     createValidator,
     emailField,
     type FormState,
     requiredText,
     type SchemaField,
} from '@/shared/lib/validation'

export const orgEditSchema = z
     .object({
          ...organizationCoreFields,
          /** yyyy-mm-dd from <input type="date">; '' = no trial end */
          trialEndsAt: z.union([z.literal(''), z.iso.date('required')]),
          ownerName: requiredText(NAME_MAX),
          ownerEmail: emailField(),
     })
     .superRefine(requireOtherType)
     .transform(dropStaleOtherType)

export type OrgEditField = SchemaField<typeof orgEditSchema>
export type OrgEditState = FormState<OrgEditField, OnboardingErrorCode>

export const validateOrgEdit = createValidator<OnboardingErrorCode>()

/** Stored as midnight UTC of the chosen day (07:00 in Cambodia — still that day). */
export const trialEndsAtToISO = (day: string): string | null =>
     day ? new Date(`${day}T00:00:00.000Z`).toISOString() : null
