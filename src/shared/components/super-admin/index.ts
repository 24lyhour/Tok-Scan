/**
 * Super-admin console UI (tok-scan staff, guide p.27) — reusable and data-free: every text and
 * number comes in as props. The super-admin module (src/modules/super-admin) loads the data, picks the
 * texts and registers these with the Payload admin.
 *
 *   theme.tsx         brand colours as CSS variables inside the Payload admin
 *   logo.tsx          AdminLogo, AdminIcon
 *   login-panel.tsx   charcoal grid panel beside the staff login
 *   login-intro.tsx   LoginIntro (badge + heading), LoginSwitchLink
 *   captcha.tsx       Turnstile for Payload's login API (token in a short-lived cookie)
 *   console-banner.tsx  "Open the console" banner on the Payload data admin home
 */
export { AdminLoginCaptcha } from './captcha'
export { ConsoleBanner } from './console-banner'
export { LoginIntro, LoginSwitchLink } from './login-intro'
export { LoginPanel } from './login-panel'
export { AdminIcon, AdminLogo } from './logo'
export { AdminTheme } from './theme'
