/**
 * Every login error code. Schemas use these codes as Zod messages; `content/*.ts → errors`
 * translates each one (en · km · zh).
 */
import { createValidator, type FormState } from '@/shared/lib/validation'

export type LoginErrorCode =
     'required' | 'emailInvalid' | 'invalidCredentials' | 'locked' | 'captcha' | 'generic'

/** Validate any auth schema → `{ ok, data }` or `{ ok: false, fieldErrors }`. */
export const validate = createValidator<LoginErrorCode>()

/** Return type of the auth server actions. */
export type AuthState<F extends string> = FormState<F, LoginErrorCode>
