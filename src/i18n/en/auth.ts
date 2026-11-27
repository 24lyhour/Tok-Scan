/**
 * English — the source of truth: `AuthContent` is derived from this object, so every
 * other language must have exactly the same keys.
 */
import type { LoginErrorCode } from '@/modules/tenancy'
import type { GoogleErrorCode } from '@/modules/tenancy'

export const auth = {
     social: {
          google: 'Continue with Google',
          apple: 'Continue with Apple',
          soon: 'Apple and Google sign-in are coming soon',
          appleSoon: 'Apple sign-in is coming soon',
          terms: 'By continuing with Google, you agree to the Terms and Privacy Policy.',
          or: 'or',
     },
     password: {
          show: 'Show password',
          hide: 'Hide password',
     },
     googleErrors: {
          cancelled: 'Google sign-in was cancelled.',
          failed: 'Google sign-in didn’t work. Please try again, or use your email.',
          unverified:
               'Your Google account’s email isn’t verified yet. Verify it with Google, or use your email.',
          unavailable: 'Google sign-in isn’t available right now. Please use your email.',
     } satisfies Record<GoogleErrorCode, string>,
     errors: {
          required: 'This field is required.',
          emailInvalid: 'Enter a valid email address, like you@restaurant.com.',
          invalidCredentials: 'That email and password don’t match. Check them and try again.',
          locked: 'Too many failed attempts. Your account is locked for 10 minutes — or reset your password.',
          captcha: 'The security check isn’t finished yet. Wait a moment, then try again.',
          generic: 'Something went wrong. Please try again.',
          passwordShort: 'Use at least 10 characters.',
          passwordMismatch: 'The two passwords don’t match.',
          tokenInvalid: 'This reset link is invalid or has expired. Ask for a new one.',
     } satisfies Record<LoginErrorCode, string>,
     login: {
          metaTitle: 'Log in',
          title: 'Welcome back',
          subtitle: 'Log in to run your restaurant.',
          /** Staff login (/admin/login): badge, then title + subtitle */
          staffBadge: 'Platform console · staff only',
          staffTitle: 'Welcome back',
          staffSubtitle: 'Log in with your tok-scan staff account.',
          /** Charcoal panel beside the staff login (large screens) */
          ownerQuestion: 'Restaurant owner?',
          ownerLink: 'Log in to your restaurant',
          staffAside: {
               title: 'Every restaurant on tok-scan, in one place.',
               points: [
                    'Approve new restaurants before they take online payments',
                    'Help owners when they get stuck',
                    'Every action on restaurant data is logged',
               ],
               pending: 'Pending approvals',
               approve: 'Approve',
               status: { pending: 'Pending approval', active: 'Active', trial: 'Trial' },
          },
          email: 'Email',
          emailPlaceholder: 'you@restaurant.com',
          password: 'Password',
          forgot: 'Forgot password?',
          submit: 'Log in',
          submitting: 'Logging in…',
          noAccount: 'New to tok·scan?',
          startTrial: 'Start a free trial',
     },
     forgot: {
          metaTitle: 'Reset your password',
          title: 'Forgot your password?',
          subtitle: 'Enter your email and we’ll send you a link to choose a new one.',
          email: 'Email',
          emailPlaceholder: 'you@restaurant.com',
          submit: 'Send reset link',
          submitting: 'Sending…',
          back: 'Back to log in',
          sentTitle: 'Check your email',
          sentBody:
               'If an account exists for that email, a reset link is on its way. It works for 1 hour.',
          spam: 'Nothing after a few minutes? Check your spam folder.',
          again: 'Send another link',
     },
     reset: {
          metaTitle: 'Choose a new password',
          title: 'Choose a new password',
          subtitle: 'You’ll be logged in right after.',
          password: 'New password',
          passwordHint: 'At least 10 characters',
          confirm: 'Repeat new password',
          submit: 'Save and log in',
          submitting: 'Saving…',
          invalidTitle: 'This link doesn’t work',
          invalidBody: 'Reset links work for 1 hour and only once. Ask for a new one.',
          requestNew: 'Send me a new link',
     },
     resetEmail: {
          subject: 'Reset your tok-scan password',
          preheader: 'Choose a new password — the link works for 1 hour.',
          title: 'Reset your password',
          greeting: 'Hi {name},',
          friend: 'there',
          body: 'We got a request to reset the password for your tok-scan account. Click the button to choose a new one.',
          button: 'Reset password',
          expiry: 'This link works for 1 hour and only once.',
          ignore: 'Didn’t ask for this? Ignore this email — your password stays the same.',
          fallback: 'Button not working? Copy this link into your browser:',
          footer: 'tok·scan — QR ordering, kitchen display and KHQR billing for restaurants',
     },
     aside: {
          title: 'Every table, live in one place.',
          body: 'Orders, kitchen tickets and KHQR payments from all your outlets — the moment they happen.',
          points: [
               'Orders arrive from every table in seconds',
               'The kitchen sees notes and allergies instantly',
               'Bills are marked paid only after the bank confirms',
          ],
          ticketTable: 'T07',
          ticketItem: '2× Fish Amok',
          ticketNote: 'No chilli · extra rice',
          paid: 'Paid · KHQR',
          markReady: 'Mark ready',
     },
}

export type AuthContent = typeof auth
