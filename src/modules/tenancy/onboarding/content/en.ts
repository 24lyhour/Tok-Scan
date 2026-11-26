/**
 * English — the source of truth: `OnboardingContent` is derived from this object, so every
 * other language must have exactly the same keys.
 */
import type { SignupErrorCode } from '../validation'

export const en = {
     shell: {
          step: 'Step {n} of {total}',
          home: 'tok-scan home',
          language: 'Language',
          progress: 'Sign-up progress',
     },
     signup: {
          metaTitle: 'Create your account',
          title: 'Create your account',
          subtitle: '14-day free trial · no card needed',
          google: 'Continue with Google',
          apple: 'Continue with Apple',
          socialSoon: 'Apple and Google sign-in are coming soon',
          or: 'or',
          name: 'Full name',
          namePlaceholder: 'Sok Dara',
          email: 'Work email',
          emailPlaceholder: 'you@restaurant.com',
          phone: 'Phone (Telegram)',
          phoneHint: 'We’ll send your verification code here.',
          password: 'Password',
          passwordHint: 'At least 10 characters',
          showPassword: 'Show password',
          hidePassword: 'Hide password',
          termsBefore: 'I agree to the',
          terms: 'Terms',
          termsAnd: 'and',
          privacy: 'Privacy Policy',
          termsAfter: '',
          submit: 'Create account',
          submitting: 'Creating account…',
          haveAccount: 'Already have an account?',
          login: 'Log in',
          errorSummary: 'Please fix the highlighted fields.',
          errors: {
               required: 'This field is required.',
               nameTooLong: 'Keep the name under 80 characters.',
               emailInvalid: 'Enter a valid email address, like you@restaurant.com.',
               phoneInvalid: 'Enter a Cambodian mobile number, e.g. 12 345 678.',
               passwordShort: 'Use at least 10 characters.',
               termsRequired: 'Please accept the Terms to continue.',
               emailTaken: 'An account with this email already exists. Log in instead.',
               captcha: 'Please complete the security check above the button, then try again.',
               generic: 'Something went wrong. Please try again.',
          } satisfies Record<SignupErrorCode, string>,
     },
     organization: {
          metaTitle: 'Your organization',
          title: 'Your organization',
          welcome: 'Welcome, {name}! Your account is ready.',
          comingNext:
               'Next you’ll name your business, choose its web address and add your logo. This step is being built.',
          backHome: 'Back to home',
     },
}

export type OnboardingContent = typeof en
