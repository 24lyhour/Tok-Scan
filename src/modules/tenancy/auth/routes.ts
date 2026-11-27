import { onboardingRoutes } from '../onboarding/routes'

/** Every sign-in URL — the only place they are written. */
export const authRoutes = {
     login: '/login',
     signup: onboardingRoutes.signup,
     /** "Forgot password?" → email a reset link */
     forgotPassword: '/forgot-password',
     /** The reset link in that email opens this page (?token=…) */
     resetPassword: '/reset-password',
     /** Resumes onboarding, or opens the dashboard once it's finished */
     afterLogin: onboardingRoutes.resume,
} as const

/**
 * Only allow same-site relative paths as the post-login destination (?next=/…),
 * so the login page can't be used to redirect people to another website.
 */
export function safeNextPath(raw: unknown, fallback: string): string {
     if (typeof raw !== 'string') return fallback
     if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return fallback
     if (raw.startsWith(authRoutes.login) || raw.startsWith(authRoutes.signup)) return fallback
     return raw
}
