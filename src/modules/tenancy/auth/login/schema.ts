/** Login — Zod schema shared by the login form and its server action. */
import { z } from 'zod'

import { emailField, type SchemaField } from '@/shared/lib/validation'

export const loginSchema = z.object({
     email: emailField(),
     password: z.string('required').min(1, 'required'),
})

export type LoginField = SchemaField<typeof loginSchema>
