/**
 * Assistant — TOKSCAN, tok-scan's chat assistant (UI preview with ready-made answers).
 * Reusable on any page: the landing page (audience "visitor") and the app shell ("owner").
 *
 *   components/   AssistantWidget (launcher, greeting bubble, chat panel, full screen)
 *   topics.ts     what it answers per audience + keyword matching (swap for the real AI later)
 *   content/      en · km · zh (`assistant` namespace)
 */
export { AssistantWidget } from './components/assistant-widget'
export type { AssistantLinks, Audience } from './topics'
