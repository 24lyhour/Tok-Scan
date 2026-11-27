/** Password reset — Zod schemas shared by the forms and their server actions. */
import { z } from 'zod'

import { emailField, type SchemaField } from '@/shared/lib/validation'

import { PASSWORD_MIN } from '../../onboarding/signup/schema'

/** Step 1 · "Forgot password?" — which account to send the link to */
export const forgotSchema = z.object({
     email: emailField(),
})

/** Step 2 · the page the email link opens — choose a new password */
export const resetSchema = z
     .object({
          token: z.string('tokenInvalid').trim().min(1, 'tokenInvalid').max(200, 'tokenInvalid'),
          password: z.string('required').min(1, 'required').min(PASSWORD_MIN, 'passwordShort'),
          confirm: z.string('required').min(1, 'required'),
     })
     .refine((data) => data.password === data.confirm, {
          path: ['confirm'],
          message: 'passwordMismatch',
     })

export type ForgotField = SchemaField<typeof forgotSchema>
export type ResetField = SchemaField<typeof resetSchema>
export { PASSWORD_MIN }
