import { onboardingRoutes } from '../onboarding/routes'

/** Every sign-in URL — the only place they are written. */
export const authRoutes = {
     login: '/login',
     signup: onboardingRoutes.signup,
     // TODO: replace with a branded reset-password flow (Payload's admin one works meanwhile)
     forgotPassword: '/admin/forgot',
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
