/**
 * Every validation / server error code used in onboarding (steps 1–4). Schemas use these codes
 * as Zod messages; `content/*.ts → errors` translates each one (en · km · zh).
 */
import { createValidator, type FormState } from '@/shared/lib/validation'

import type { SlugProblem } from '../collections/organizations/slug'

export type OnboardingErrorCode =
     | 'required'
     | 'tooLong'
     // step 1 · account
     | 'emailInvalid'
     | 'phoneInvalid'
     | 'passwordShort'
     | 'termsRequired'
     | 'emailTaken'
     | 'captcha'
     // step 2 · organization
     | 'slugTooShort'
     | 'slugTooLong'
     | 'slugInvalid'
     | 'slugReserved'
     | 'slugTaken'
     | 'logoType'
     | 'logoSize'
     // step 3 · outlet
     | 'number'
     | 'percent'
     | 'time'
     | 'days'
     // step 4 · tables
     | 'tableCount'
     | 'generic'

/** Validate any onboarding schema → `{ ok, data }` or `{ ok: false, fieldErrors }`. */
export const validate = createValidator<OnboardingErrorCode>()

/** Return type of every onboarding server action. */
export type StepState<F extends string> = FormState<F, OnboardingErrorCode>

export const slugProblemToError: Record<SlugProblem, OnboardingErrorCode> = {
     tooShort: 'slugTooShort',
     tooLong: 'slugTooLong',
     invalid: 'slugInvalid',
     reserved: 'slugReserved',
     taken: 'slugTaken',
}
