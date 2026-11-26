/** Step 1 · account — Zod schema shared by the sign-up form and its server action. */
import { z } from 'zod'

import { emailField, requiredText, type SchemaField } from '@/shared/lib/validation'

export const PASSWORD_MIN = 10
export const NAME_MAX = 80

/** "012 345 678" / "12-345-678" / "+855 12 345 678" → "+85512345678", or null if not a KH number */
export function normalizeCambodianPhone(raw: string): string | null {
     let digits = raw.replace(/[\s\-().]/g, '')
     if (digits.startsWith('+855')) digits = digits.slice(4)
     else if (digits.startsWith('855') && digits.length > 10) digits = digits.slice(3)
     if (digits.startsWith('0')) digits = digits.slice(1)
     return /^[1-9]\d{7,8}$/.test(digits) ? `+855${digits}` : null
}

export const signupSchema = z.object({
     name: requiredText(NAME_MAX),
     email: emailField(),
     /** Typed without +855; stored as E.164 */
     phone: z
          .string('required')
          .trim()
          .min(1, 'required')
          .transform((raw, ctx) => {
               const phone = normalizeCambodianPhone(raw)
               if (!phone) ctx.issues.push({ code: 'custom', message: 'phoneInvalid', input: raw })
               return phone ?? raw
          }),
     password: z.string('required').min(1, 'required').min(PASSWORD_MIN, 'passwordShort'),
     /** Checkbox: posts "on" only when ticked */
     terms: z.literal('on', 'termsRequired'),
})

export type SignupField = SchemaField<typeof signupSchema>
