# marketing — public website

| Folder       | What                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `landing/`   | Home page at `/` (guide p.21–22), en · km · zh. Every main button leads to `/signup`.                                                                                           |
| `assistant/` | **TOKSCAN** chat assistant: launcher + greeting bubble ("Hello valued customer 👋") + chat panel. UI preview with ready-made answers (`topics.ts`); the real AI plugs in later. |
| `consent/`   | Cookie banner (Accept all / Essential only), stored in the `tok-consent` cookie for 6 months. Load analytics only when `getConsent()` / `useConsent()` is `'all'`.              |

Entry point: `index.ts` (`LandingPage`). The greeting appears 1.5 s after the cookie choice, once per browser session.
