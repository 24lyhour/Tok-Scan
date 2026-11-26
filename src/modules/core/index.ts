/**
 * Core — platform-wide building blocks shared by every module.
 *
 *   access.ts      who-can-do-what rules (roles) used by every collection
 *   collections/   data: media (+ Vercel Blob storage)      (backend entry: payload.ts)
 *   i18n/          Payload content localization + admin UI languages
 */
export * from './access'
