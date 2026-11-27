import { resendAdapter } from '@payloadcms/email-resend'

/**
 * Outgoing email through Resend (https://resend.com): password reset now, later sign-up codes,
 * onboarding messages and approval notices (guide p.22).
 *
 * Needs RESEND_API_KEY. The sender domain (tok-scan.store) must be verified in Resend → Domains.
 * Without a key (local development) Payload prints every email to the terminal instead.
 */
export const emailAdapter = process.env.RESEND_API_KEY
     ? resendAdapter({
            apiKey: process.env.RESEND_API_KEY,
            defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@tok-scan.store',
            defaultFromName: process.env.EMAIL_FROM_NAME || 'tok-scan',
       })
     : undefined
