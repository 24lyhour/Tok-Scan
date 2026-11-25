/**
 * Sign-up validation — pure functions, no server imports, so the client can reuse the rules.
 * Returns error *codes*; the UI turns them into English/Khmer messages.
 */

export const PASSWORD_MIN = 10

export type SignupField = 'name' | 'email' | 'phone' | 'password' | 'terms'

export type SignupErrorCode =
     | 'required'
     | 'nameTooLong'
     | 'emailInvalid'
     | 'phoneInvalid'
     | 'passwordShort'
     | 'termsRequired'
     | 'emailTaken'
     | 'captcha'
     | 'generic'

export type SignupValues = {
     name: string
     email: string
     /** Local Cambodian number as typed, without +855 */
     phone: string
     password: string
     terms: boolean
}

export type SignupInput = {
     name: string
     email: string
     /** E.164, e.g. +85512345678 */
     phone: string
     password: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** "012 345 678" / "12-345-678" / "+855 12 345 678" → "+85512345678", or null if not a KH number */
export function normalizeCambodianPhone(raw: string): string | null {
     let digits = raw.replace(/[\s\-().]/g, '')
     if (digits.startsWith('+855')) digits = digits.slice(4)
     else if (digits.startsWith('855') && digits.length > 10) digits = digits.slice(3)
     if (digits.startsWith('0')) digits = digits.slice(1)
     return /^[1-9]\d{7,8}$/.test(digits) ? `+855${digits}` : null
}

export function validateSignup(
     values: SignupValues,
):
     | { ok: true; data: SignupInput }
     | { ok: false; fieldErrors: Partial<Record<SignupField, SignupErrorCode>> } {
     const fieldErrors: Partial<Record<SignupField, SignupErrorCode>> = {}

     const name = values.name.trim().replace(/\s+/g, ' ')
     if (!name) fieldErrors.name = 'required'
     else if (name.length > 80) fieldErrors.name = 'nameTooLong'

     const email = values.email.trim().toLowerCase()
     if (!email) fieldErrors.email = 'required'
     else if (!EMAIL.test(email)) fieldErrors.email = 'emailInvalid'

     const phone = values.phone.trim() ? normalizeCambodianPhone(values.phone) : null
     if (!values.phone.trim()) fieldErrors.phone = 'required'
     else if (!phone) fieldErrors.phone = 'phoneInvalid'

     if (!values.password) fieldErrors.password = 'required'
     else if (values.password.length < PASSWORD_MIN) fieldErrors.password = 'passwordShort'

     if (!values.terms) fieldErrors.terms = 'termsRequired'

     if (Object.keys(fieldErrors).length > 0 || !phone) return { ok: false, fieldErrors }
     return { ok: true, data: { name, email, phone, password: values.password } }
}
