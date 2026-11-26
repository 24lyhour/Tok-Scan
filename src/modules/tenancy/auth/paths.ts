/** URLs used across sign-in, sign-up and Google sign-in. */
export const authRoutes = {
     login: '/login',
     signup: '/signup',
     // TODO: replace with a branded reset-password flow (Payload's admin one works meanwhile)
     forgotPassword: '/admin/forgot',
     // TODO(staff app): send owners to their dashboard once it exists
     afterLogin: '/onboarding/organization',
} as const
