/** Login validation — pure, shared by client and server. Returns error codes, not messages. */

export type LoginField = 'email' | 'password'

export type LoginErrorCode =
     'required' | 'emailInvalid' | 'invalidCredentials' | 'locked' | 'generic'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateLogin(values: {
     email: string
     password: string
}):
     | { ok: true; data: { email: string; password: string } }
     | { ok: false; fieldErrors: Partial<Record<LoginField, LoginErrorCode>> } {
     const fieldErrors: Partial<Record<LoginField, LoginErrorCode>> = {}
     const email = values.email.trim().toLowerCase()
     if (!email) fieldErrors.email = 'required'
     else if (!EMAIL.test(email)) fieldErrors.email = 'emailInvalid'
     if (!values.password) fieldErrors.password = 'required'

     if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }
     return { ok: true, data: { email, password: values.password } }
}

/**
 * Only allow same-site relative paths as the post-login destination (?next=/…),
 * so the login page can't be used to redirect people to another website.
 */
export function safeNextPath(raw: unknown, fallback: string): string {
     if (typeof raw !== 'string') return fallback
     if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return fallback
     if (raw.startsWith('/login') || raw.startsWith('/signup')) return fallback
     return raw
}
