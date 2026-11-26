'use client'

import { cn } from '@/shared/lib/utils'

import type { AuthContent } from '../auth/content'

function GoogleIcon() {
     return (
          <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]">
               <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
               />
               <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
               />
               <path
                    fill="#FBBC05"
                    d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"
               />
               <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
               />
          </svg>
     )
}

function AppleIcon() {
     return (
          <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="currentColor">
               <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
          </svg>
     )
}

const socialButton =
     'inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl text-[0.9375rem] font-semibold disabled:cursor-not-allowed disabled:opacity-60'

/**
 * "Continue with Apple" + "Continue with Google", followed by an "or" divider.
 * - Google is a real link to /auth/google when `googleHref` is set (env configured), else disabled.
 * - Apple stays disabled until an Apple Developer account is set up.
 * Apple's button is black with the Apple logo and the same size as Google's (Apple HIG).
 */
export function SocialSignIn({
     id,
     copy,
     googleHref,
     showTerms = false,
}: {
     id: string
     /** `auth` → `social` texts */
     copy: AuthContent['social']
     /** null/undefined → Google not configured, show it as "coming soon" */
     googleHref?: string | null
     /** Show "By continuing with Google you agree to the Terms…" (sign-up) */
     showTerms?: boolean
}) {
     const note = googleHref ? copy.appleSoon : copy.soon
     return (
          <>
               <div className="space-y-2.5">
                    <button
                         type="button"
                         disabled
                         title={copy.appleSoon}
                         aria-describedby={`${id}-soon`}
                         className={cn(socialButton, 'bg-black text-white')}
                    >
                         <AppleIcon />
                         {copy.apple}
                    </button>
                    {googleHref ? (
                         // Plain link: the browser does a full navigation to Google's account chooser
                         <a
                              href={googleHref}
                              className={cn(
                                   socialButton,
                                   'border border-line bg-white text-ink transition-colors duration-[120ms] outline-none hover:bg-paper focus-visible:ring-3 focus-visible:ring-brand-300',
                              )}
                         >
                              <GoogleIcon />
                              {copy.google}
                         </a>
                    ) : (
                         <button
                              type="button"
                              disabled
                              title={copy.soon}
                              aria-describedby={`${id}-soon`}
                              className={cn(socialButton, 'border border-line bg-white text-ink')}
                         >
                              <GoogleIcon />
                              {copy.google}
                         </button>
                    )}
               </div>
               <p id={`${id}-soon`} className="mt-2 text-center text-xs text-ink-3">
                    {note}
               </p>
               {googleHref && showTerms && (
                    <p className="mt-1 text-center text-xs text-ink-3">{copy.terms}</p>
               )}
               <div className="my-5 flex items-center gap-3 text-xs text-ink-3" aria-hidden>
                    <span className="h-px flex-1 bg-line" />
                    {copy.or}
                    <span className="h-px flex-1 bg-line" />
               </div>
          </>
     )
}
