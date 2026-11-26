# marketing — public website

| Folder     | What                                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `landing/` | Home page at `/` (guide p.21–22), en · km · zh. Every main button leads to `/signup`.                                                                              |
| `consent/` | Cookie banner (Accept all / Essential only), stored in the `tok-consent` cookie for 6 months. Load analytics only when `getConsent()` / `useConsent()` is `'all'`. |

Entry point: `index.ts` (`LandingPage`). The TOKSCAN chat lives in its own module, `src/modules/assistant` (also used in the app). The greeting appears 1.5 s after the cookie choice, once per browser session.
