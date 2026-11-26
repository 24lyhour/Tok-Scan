# assistant — TOKSCAN

Chat assistant used on **any page** — one component, two audiences:

| Audience  | Where                  | Greeting                                              | Suggested questions                       |
| --------- | ---------------------- | ----------------------------------------------------- | ----------------------------------------- |
| `visitor` | landing page           | "Hello valued customer 👋 How can tok-scan help you?" | QR ordering · KHQR · pricing · free trial |
| `owner`   | app shell (dashboard…) | "Hi {name} 👋 Need help getting set up?"              | menu · KHQR setup · staff · QR printing   |

```tsx
<AssistantWidget audience="visitor" links={{ signup, pricing: '#pricing', contact }} startingPrice={19} />
<AssistantWidget audience="owner" name="Sok" links={{ contact }} />
```

The page passes the links, so the widget doesn't depend on any other module. Today the answers are
ready-made (`topics.ts`, keyword matching in en · km · zh); the real AI replaces `matchTopic` later
without changing the UI. Greeting: once per browser session per audience. Full screen with ⤢, Esc to exit.
