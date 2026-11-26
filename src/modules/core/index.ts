/**
 * Core — platform-wide building blocks shared by every module.
 *
 *   plans.ts       plan limits (outlets, tables, staff) + the free-trial plan   ← public (index.ts)
 *   access.ts      who-can-do-what rules used by every collection          ← backend (payload.ts)
 *   collections/   data: media (+ Vercel Blob storage)                     ← backend (payload.ts)
 *   i18n/          Payload content localization + admin UI languages       ← backend (payload.ts)
 *
 * Public API — safe in pages, server actions and client components.
 */
export * from './plans'
