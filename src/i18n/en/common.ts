/**
 * English — the source of truth: `CommonMessages` is derived from this object, so every
 * other language must have exactly the same keys.
 */
export const common = {
     meta: {
          title: 'tok·scan — QR ordering & billing for Cambodian restaurants',
          /** `%s` = page title */
          titleTemplate: '%s · tok·scan',
          description:
               'Guests order from their phone, the kitchen sees it instantly, and bills are paid by KHQR. One restaurant or twenty outlets.',
     },
     language: 'Language',
     home: 'tok-scan home',
     skipToContent: 'Skip to content',
     poweredBy: 'Powered by',
     actions: {
          continue: 'Continue',
          back: 'Back',
          cancel: 'Cancel',
          save: 'Save',
          saveChanges: 'Save changes',
          close: 'Close',
          edit: 'Edit',
          delete: 'Delete',
          tryAgain: 'Try again',
          logIn: 'Log in',
          logOut: 'Log out',
     },
     /** "Log out?" confirmation (sidebar log-out button) */
     logout: {
          title: 'Log out?',
          body: 'You’ll need to log in again to get back to tok-scan.',
          confirm: 'Log out',
          pending: 'Logging out…',
     },
     /** Bot check status under the form (Cloudflare Turnstile) */
     security: {
          checking: 'Checking your connection…',
          verified: 'Verified · protected by Cloudflare',
          failed: 'Security check couldn’t load. Refresh the page and try again.',
     },
     states: {
          loading: 'Loading…',
          saving: 'Saving…',
          saved: 'Saved',
          empty: 'Nothing here yet',
          error: 'Something went wrong. Please try again.',
          required: 'Required',
          optional: 'Optional',
          soon: 'Soon',
          /** Under a disabled button — followed by a red * */
          fillRequired: 'Fill in all fields marked',
     },
}

export type CommonMessages = typeof common
