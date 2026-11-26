/**
 * English — the source of truth: `AuthContent` is derived from this object, so every
 * other language must have exactly the same keys.
 */
import type { LoginErrorCode } from '../validation'
import type { GoogleErrorCode } from '../google/config'

export const en = {
     login: {
          metaTitle: 'Log in',
          title: 'Welcome back',
          subtitle: 'Log in to run your restaurant.',
          google: 'Continue with Google',
          apple: 'Continue with Apple',
          socialSoon: 'Apple and Google sign-in are coming soon',
          appleSoon: 'Apple sign-in is coming soon',
          socialTerms: 'By continuing with Google, you agree to the Terms and Privacy Policy.',
          googleErrors: {
               cancelled: 'Google sign-in was cancelled.',
               failed: 'Google sign-in didn’t work. Please try again, or use your email.',
               unverified:
                    'Your Google account’s email isn’t verified yet. Verify it with Google, or use your email.',
               unavailable: 'Google sign-in isn’t available right now. Please use your email.',
          } satisfies Record<GoogleErrorCode, string>,
          or: 'or',
          email: 'Email',
          emailPlaceholder: 'you@restaurant.com',
          password: 'Password',
          forgot: 'Forgot password?',
          showPassword: 'Show password',
          hidePassword: 'Hide password',
          submit: 'Log in',
          submitting: 'Logging in…',
          noAccount: 'New to tok·scan?',
          startTrial: 'Start a free trial',
          errors: {
               required: 'This field is required.',
               emailInvalid: 'Enter a valid email address, like you@restaurant.com.',
               invalidCredentials: 'That email and password don’t match. Check them and try again.',
               locked: 'Too many failed attempts. Your account is locked for 10 minutes — or reset your password.',
               captcha: 'Please complete the security check above the button, then try again.',
               generic: 'Something went wrong. Please try again.',
          } satisfies Record<LoginErrorCode, string>,
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

export type AuthContent = typeof en
