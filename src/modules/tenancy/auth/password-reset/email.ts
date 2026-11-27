/**
 * Branded "reset your password" email (tok-scan logo, green button) in the reader's language.
 * Email apps ignore <style> and CSS variables, so everything is inline; colours come from the one
 * shared colour list.
 */
import type { CollectionConfig, PayloadRequest } from 'payload'

import { getNamespace } from '@/i18n/messages'
import { COLORS } from '@/shared/config/colors'
import { getServerURL } from '@/shared/config/server-url'
import { interpolate } from '@/shared/i18n/format'
import { isLocale, LOCALE_COOKIE, type Locale } from '@/shared/i18n/locales'

import { authRoutes } from '../routes'

/** What the forgot-password action passes to Payload (`context`) so the email knows the site and language. */
export type ResetEmailContext = { resetOrigin?: string; resetLocale?: Locale }

const escape = (text: string) =>
     text.replace(
          /[&<>"']/g,
          (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
     )

/** The reset page URL with its single-use token (`staff`: a tok-scan staff account, `admins`). */
export function resetUrl(origin: string, token: string, staff = false): string {
     const url = `${origin.replace(/\/$/, '')}${authRoutes.resetPassword}?token=${encodeURIComponent(token)}`
     return staff ? `${url}&staff=1` : url
}

/** Subject + HTML for one reset email. */
export function resetPasswordEmail({
     origin,
     token,
     name,
     locale,
     staff = false,
}: {
     origin: string
     token: string
     name?: string | null
     locale: Locale
     staff?: boolean
}): { subject: string; html: string } {
     const m = getNamespace(locale, 'auth').resetEmail
     const url = resetUrl(origin, token, staff)
     const greeting = interpolate(m.greeting, { name: escape(name?.trim() || m.friend) })
     const logo = `${origin.replace(/\/$/, '')}/icon-192.png`

     const html = `<!doctype html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(m.subject)}</title></head>
<body style="margin:0;padding:0;background:${COLORS.paper};font-family:Inter,'Kantumruy Pro',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${COLORS.ink};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0">${escape(m.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.paper};padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px">
        <tr><td style="padding:0 4px 20px">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td><img src="${logo}" width="36" height="36" alt="" style="display:block;border-radius:8px"></td>
            <td style="padding-left:10px;font-size:18px;font-weight:700;color:${COLORS['brand-700']}">tok<span style="color:${COLORS['saffron-500']}">·</span>scan</td>
          </tr></table>
        </td></tr>
        <tr><td style="background:#ffffff;border:1px solid ${COLORS.line};border-radius:20px;padding:32px 28px">
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:${COLORS.ink}">${escape(m.title)}</h1>
          <p style="margin:0 0 12px;font-size:15px;line-height:1.6">${greeting}</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6">${escape(m.body)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:12px;background:${COLORS['brand-700']}">
            <a href="${url}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px">${escape(m.button)}</a>
          </td></tr></table>
          <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:${COLORS['ink-2']}">${escape(m.expiry)}</p>
          <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:${COLORS['ink-2']}">${escape(m.ignore)}</p>
          <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid ${COLORS.line};font-size:12px;line-height:1.6;color:${COLORS['ink-3']}">${escape(m.fallback)}<br><a href="${url}" style="color:${COLORS['brand-700']};word-break:break-all">${url}</a></p>
        </td></tr>
        <tr><td style="padding:20px 4px 0;font-size:12px;line-height:1.6;color:${COLORS['ink-3']};text-align:center">${escape(m.footer)}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

     return { subject: m.subject, html }
}

/** Language and site address for an email sent during this request. */
function emailSettings(req: PayloadRequest): { origin: string; locale: Locale } {
     const context = (req.context ?? {}) as ResetEmailContext
     const cookieLocale = req.headers
          ?.get('cookie')
          ?.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`))?.[1]
     const host = req.headers?.get('x-forwarded-host') ?? req.headers?.get('host')
     const proto =
          req.headers?.get('x-forwarded-proto') ??
          (host?.startsWith('localhost') ? 'http' : 'https')
     return {
          origin:
               context.resetOrigin ||
               getServerURL() ||
               (host ? `${proto}://${host}` : 'http://localhost:3000'),
          locale: context.resetLocale ?? (isLocale(cookieLocale) ? cookieLocale : 'en'),
     }
}

/**
 * `auth.forgotPassword` for an auth table: Payload's reset email, branded, linking to tok-scan's
 * /reset-password page (also when the reset is started from Payload's admin).
 *   users:  brandedForgotPassword()          admins: brandedForgotPassword({ staff: true })
 */
export function brandedForgotPassword({ staff = false }: { staff?: boolean } = {}): NonNullable<
     Exclude<CollectionConfig['auth'], boolean | undefined>['forgotPassword']
> {
     return {
          generateEmailSubject: (args) => {
               const locale = args?.req ? emailSettings(args.req).locale : 'en'
               return getNamespace(locale, 'auth').resetEmail.subject
          },
          generateEmailHTML: (args) => {
               const settings = args?.req
                    ? emailSettings(args.req)
                    : { origin: getServerURL() || 'http://localhost:3000', locale: 'en' as const }
               const name = (args?.user as { name?: string | null } | undefined)?.name
               return resetPasswordEmail({ ...settings, token: args?.token ?? '', name, staff })
                    .html
          },
     }
}
