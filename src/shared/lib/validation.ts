/**
 * Form validation with Zod — one pattern for every form (client check + server action).
 *
 * Schemas use an error CODE as their message (`.min(1, 'required')`), never English text.
 * The UI looks the code up in the feature's translations, so errors show in en / km / zh.
 *
 *   const validate = createValidator<SignupErrorCode>()
 *   const result = validate(signupSchema, formValues(formData))
 *   if (!result.ok) return { status: 'error', fieldErrors: result.fieldErrors }
 */
import { z } from 'zod'

/** field → error code */
export type FieldErrors<F extends string, C extends string> = Partial<Record<F, C>>

/** What a form's server action returns (React `useActionState`). */
export type FormState<F extends string, C extends string> = {
     status: 'idle' | 'error'
     fieldErrors?: FieldErrors<F, C>
     formError?: C
}

export type Validation<F extends string, C extends string, D> =
     { ok: true; data: D } | { ok: false; fieldErrors: FieldErrors<F, C> }

/** Field names of a schema (its input keys). */
export type SchemaField<S extends z.ZodType> = Extract<keyof z.input<S>, string>

/**
 * Validator bound to one feature's error codes. Returns the FIRST error code per field.
 * Call it with any schema; field names come from the schema.
 */
export function createValidator<C extends string>() {
     return function validate<S extends z.ZodType>(
          schema: S,
          values: unknown,
     ): Validation<SchemaField<S>, C, z.output<S>> {
          const result = schema.safeParse(values)
          if (result.success) return { ok: true, data: result.data }
          const fieldErrors: FieldErrors<SchemaField<S>, C> = {}
          for (const issue of result.error.issues) {
               const field = issue.path[0] as SchemaField<S> | undefined
               if (field !== undefined && !fieldErrors[field])
                    fieldErrors[field] = issue.message as C
          }
          return { ok: false, fieldErrors }
     }
}

/**
 * FormData → plain object for a schema. Fields listed in `lists` are always arrays
 * (checkbox / chip groups); other repeated names keep their first value.
 */
export function formValues(
     formData: FormData,
     lists: readonly string[] = [],
): Record<string, unknown> {
     const values: Record<string, unknown> = {}
     for (const name of lists) values[name] = formData.getAll(name)
     for (const [name, value] of formData.entries()) {
          if (!(name in values)) values[name] = value
     }
     return values
}

/* ───────── Reusable field schemas ───────── */

/** Trimmed text with inner whitespace collapsed; '' → `required`, over `max` → `tooLong`. */
export const requiredText = (max: number) =>
     z
          .string('required')
          .transform((s) => s.trim().replace(/\s+/g, ' '))
          .pipe(z.string().min(1, 'required').max(max, 'tooLong'))

/** Optional trimmed text ('' when missing). */
export const optionalText = (max: number) =>
     z
          .string()
          .trim()
          .max(max, 'tooLong')
          .optional()
          .transform((s) => s ?? '')

/** Required, normalised email (trimmed, lower-case). */
export const emailField = () =>
     z.string('required').trim().toLowerCase().min(1, 'required').pipe(z.email('emailInvalid'))

/** Form numbers: accepts "4,100"; NaN / out of range → `code`. */
export const numberField = (code: string, min: number, max: number) =>
     z.preprocess(
          (v) => (typeof v === 'string' ? v.replace(/,/g, '').trim() : v),
          z.coerce.number(code).min(min, code).max(max, code),
     )

/** On/off switch posted as "on" / "off" (missing → false). */
export const switchField = () =>
     z
          .stringbool()
          .optional()
          .transform((b) => b ?? false)
