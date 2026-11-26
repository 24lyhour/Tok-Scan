'use client'

import { Maximize2, Minimize2, SendHorizontal, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { useTranslations } from '@/i18n/client'
import { LogoMark } from '@/shared/components/brand/logo'
import { formatMoney, interpolate } from '@/shared/i18n/format'
import { cn } from '@/shared/lib/utils'

import type { Consent } from '../../consent/consent'
import { useConsent } from '../../consent/use-consent'
import { matchTopic, REPLY_ACTIONS, STARTING_PRICE, TOPIC_IDS, type ReplyId } from '../topics'

type Message = {
     id: number
     from: 'bot' | 'user'
     text: string
     action?: { label: string; href: string }
}

/** The greeting shows once per browser session */
const GREETED_KEY = 'tok-assistant-greeted'
const GREETING_DELAY = 1000
const TYPING_DELAY = 700

function wasGreeted(): boolean {
     try {
          return sessionStorage.getItem(GREETED_KEY) === '1'
     } catch {
          return false
     }
}
function markGreeted() {
     try {
          sessionStorage.setItem(GREETED_KEY, '1')
     } catch {
          // private mode / storage blocked — the greeting may show again, that's fine
     }
}

/**
 * TOKSCAN — tok-scan's assistant (UI preview, ready-made answers; real AI later).
 * - Launcher bottom-right; on first open a greeting bubble waves hello after 1 s (once a session).
 *   On phones it sits above the cookie banner while that is open (`--consent-offset`).
 * - Panel: welcome, suggested questions, typed questions, typing indicator, an action per answer.
 * - Full screen: ⤢ in the header (text stays at a readable width, page behind stops scrolling).
 * - Keyboard: Esc leaves full screen first, then closes and returns focus to the launcher.
 */
export function AssistantWidget({ consent: initialConsent }: { consent: Consent | null }) {
     const { m } = useTranslations('assistant')
     const consent = useConsent(initialConsent)
     const panelId = useId()
     const titleId = useId()

     const [open, setOpen] = useState(false)
     const [expanded, setExpanded] = useState(false)
     const [greeting, setGreeting] = useState(false)
     const [messages, setMessages] = useState<Message[]>([])
     const [typing, setTyping] = useState(false)
     const [draft, setDraft] = useState('')

     const launcherRef = useRef<HTMLButtonElement>(null)
     const inputRef = useRef<HTMLInputElement>(null)
     const listRef = useRef<HTMLDivElement>(null)
     const nextId = useRef(1)
     const timers = useRef<ReturnType<typeof setTimeout>[]>([])

     // Greeting: on first open, once per browser session
     useEffect(() => {
          if (open) return
          const timer = setTimeout(() => {
               if (!wasGreeted()) setGreeting(true)
          }, GREETING_DELAY)
          return () => clearTimeout(timer)
     }, [open])

     useEffect(() => {
          if (open) inputRef.current?.focus()
     }, [open, expanded])

     // Full screen: the page behind must not scroll
     useEffect(() => {
          if (!expanded) return
          const previous = document.body.style.overflow
          document.body.style.overflow = 'hidden'
          return () => {
               document.body.style.overflow = previous
          }
     }, [expanded])

     useEffect(() => {
          listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
     }, [messages, typing])

     useEffect(() => {
          const pending = timers.current
          return () => pending.forEach(clearTimeout)
     }, [])

     const openPanel = () => {
          setOpen(true)
          setGreeting(false)
          markGreeted()
     }
     const closePanel = () => {
          setOpen(false)
          setExpanded(false)
          launcherRef.current?.focus()
     }
     const onPanelKey = (e: React.KeyboardEvent) => {
          if (e.key !== 'Escape') return
          if (expanded) setExpanded(false)
          else closePanel()
     }
     const dismissGreeting = () => {
          setGreeting(false)
          markGreeted()
     }

     const replyFor = (id: ReplyId): Omit<Message, 'id' | 'from'> => {
          const { action, href } = REPLY_ACTIONS[id]
          return {
               text: interpolate(m.answers[id], { price: formatMoney(STARTING_PRICE) }),
               action: { label: m.actions[action], href },
          }
     }

     const ask = (question: string, reply: ReplyId) => {
          setMessages((list) => [...list, { id: nextId.current++, from: 'user', text: question }])
          setTyping(true)
          timers.current.push(
               setTimeout(() => {
                    setTyping(false)
                    setMessages((list) => [
                         ...list,
                         { id: nextId.current++, from: 'bot', ...replyFor(reply) },
                    ])
               }, TYPING_DELAY),
          )
     }

     const onSend = (e: FormEvent) => {
          e.preventDefault()
          const text = draft.trim()
          if (!text || typing) return
          setDraft('')
          ask(text, matchTopic(text))
     }

     return (
          <div
               className={cn(
                    'pointer-events-none fixed right-4 bottom-4 z-[45] flex flex-col items-end gap-3 transition-[bottom] duration-300 ease-out-soft sm:right-6 sm:bottom-6',
                    // Phones: stay above the cookie banner while it's open (it sets --consent-offset)
                    !consent && 'max-sm:bottom-[calc(var(--consent-offset,0px)+1rem)]',
               )}
          >
               {open && (
                    <section
                         id={panelId}
                         role="dialog"
                         aria-modal={expanded}
                         aria-labelledby={titleId}
                         onKeyDown={onPanelKey}
                         className={cn(
                              'pointer-events-auto flex origin-bottom-right flex-col overflow-hidden bg-white motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95',
                              expanded
                                   ? 'fixed inset-0 h-dvh w-screen'
                                   : 'h-[min(36rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-line shadow-[0_24px_64px_-20px_rgb(22_24_29/0.45)]',
                         )}
                    >
                         <header className="flex items-center gap-3 bg-brand-700 px-4 py-3 text-white">
                              <Avatar className="size-10 ring-2 ring-white/25" />
                              <div className="min-w-0 flex-1">
                                   <h2 id={titleId} className="font-bold tracking-wide">
                                        {m.panel.title}
                                   </h2>
                                   <p className="flex items-center gap-1.5 text-xs text-white/75">
                                        <span
                                             aria-hidden
                                             className="size-2 rounded-full bg-success"
                                        />
                                        {m.panel.subtitle}
                                   </p>
                              </div>
                              <button
                                   type="button"
                                   onClick={() => setExpanded((v) => !v)}
                                   aria-label={expanded ? m.panel.collapse : m.panel.expand}
                                   aria-pressed={expanded}
                                   title={expanded ? m.panel.collapse : m.panel.expand}
                                   className="flex size-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none"
                              >
                                   {expanded ? (
                                        <Minimize2 aria-hidden className="size-[18px]" />
                                   ) : (
                                        <Maximize2 aria-hidden className="size-[18px]" />
                                   )}
                              </button>
                              <button
                                   type="button"
                                   onClick={closePanel}
                                   aria-label={m.panel.close}
                                   className="flex size-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none"
                              >
                                   <X aria-hidden className="size-5" />
                              </button>
                         </header>

                         <div
                              ref={listRef}
                              aria-live="polite"
                              className="flex-1 overflow-y-auto px-4 py-4"
                         >
                              <div
                                   className={cn(
                                        'space-y-3',
                                        expanded && 'mx-auto w-full max-w-3xl py-4',
                                   )}
                              >
                                   <BotBubble text={m.panel.welcome} />
                                   <div
                                        role="group"
                                        aria-label={m.panel.suggestionsLabel}
                                        className="flex flex-wrap gap-2 pl-9"
                                   >
                                        {TOPIC_IDS.map((id) => (
                                             <button
                                                  key={id}
                                                  type="button"
                                                  disabled={typing}
                                                  onClick={() => ask(m.topics[id], id)}
                                                  className="rounded-full border border-brand-300 bg-brand-50 px-3 py-1.5 text-left text-xs font-medium text-brand-700 hover:bg-brand-100 disabled:opacity-50"
                                             >
                                                  {m.topics[id]}
                                             </button>
                                        ))}
                                   </div>
                                   {messages.map((msg) =>
                                        msg.from === 'user' ? (
                                             <p
                                                  key={msg.id}
                                                  className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-brand-700 px-3.5 py-2.5 text-sm text-white"
                                             >
                                                  {msg.text}
                                             </p>
                                        ) : (
                                             <BotBubble
                                                  key={msg.id}
                                                  text={msg.text}
                                                  action={msg.action}
                                                  onAction={closePanel}
                                             />
                                        ),
                                   )}
                                   {typing && (
                                        <div className="flex items-end gap-2">
                                             <Avatar className="size-7" />
                                             <span className="flex gap-1 rounded-2xl rounded-tl-md bg-paper px-3.5 py-3">
                                                  <span className="sr-only">{m.panel.typing}</span>
                                                  {[0, 150, 300].map((delay) => (
                                                       <span
                                                            key={delay}
                                                            aria-hidden
                                                            style={{ animationDelay: `${delay}ms` }}
                                                            className="size-1.5 rounded-full bg-ink-3 motion-safe:animate-bounce"
                                                       />
                                                  ))}
                                             </span>
                                        </div>
                                   )}
                              </div>
                         </div>

                         <form
                              onSubmit={onSend}
                              className={cn('border-t border-line p-3', expanded && 'pb-5')}
                         >
                              <div className={cn(expanded && 'mx-auto w-full max-w-3xl')}>
                                   <div className="flex items-center gap-2">
                                        <input
                                             ref={inputRef}
                                             value={draft}
                                             onChange={(e) => setDraft(e.target.value)}
                                             maxLength={300}
                                             placeholder={m.panel.placeholder}
                                             aria-label={m.panel.placeholder}
                                             className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15"
                                        />
                                        <button
                                             type="submit"
                                             disabled={!draft.trim() || typing}
                                             aria-label={m.panel.send}
                                             className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white enabled:hover:bg-brand-800 disabled:opacity-40"
                                        >
                                             <SendHorizontal aria-hidden className="size-5" />
                                        </button>
                                   </div>
                                   <p className="mt-2 text-center text-[0.6875rem] leading-snug text-ink-3">
                                        {m.panel.disclaimer}
                                   </p>
                              </div>
                         </form>
                    </section>
               )}

               <div className="flex items-end gap-3">
                    {greeting && !open && (
                         <div className="pointer-events-auto relative mb-2 max-w-[15rem] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-3">
                              <button
                                   type="button"
                                   onClick={openPanel}
                                   className="block rounded-2xl rounded-br-md bg-white px-4 py-3 text-left text-sm text-ink shadow-[0_12px_32px_-12px_rgb(22_24_29/0.4)] ring-1 ring-line hover:ring-brand-300"
                              >
                                   <span className="block font-semibold">
                                        {m.greeting.hello}{' '}
                                        <span
                                             aria-hidden
                                             className="inline-block origin-[70%_70%] motion-safe:animate-wave"
                                        >
                                             👋
                                        </span>
                                   </span>
                                   <span className="block text-ink-2">{m.greeting.question}</span>
                              </button>
                              <button
                                   type="button"
                                   onClick={dismissGreeting}
                                   aria-label={m.greeting.dismiss}
                                   className="absolute -top-3 -left-3 flex size-7 items-center justify-center rounded-full bg-ink-3 text-white shadow hover:bg-ink-2 focus-visible:ring-3 focus-visible:ring-brand-300 focus-visible:outline-none"
                              >
                                   <X aria-hidden className="size-3.5" />
                              </button>
                         </div>
                    )}

                    <button
                         ref={launcherRef}
                         type="button"
                         onClick={open ? closePanel : openPanel}
                         aria-expanded={open}
                         aria-controls={open ? panelId : undefined}
                         aria-label={open ? m.launcher.close : m.launcher.open}
                         className={cn(
                              'pointer-events-auto relative flex size-14 items-center justify-center rounded-full bg-brand-700 text-white shadow-[0_12px_32px_-8px_rgb(20_81_63/0.6)] ring-4 ring-white transition-transform duration-[120ms] hover:scale-105 focus-visible:ring-brand-300 focus-visible:outline-none',
                              // Full screen has its own close button
                              expanded && 'hidden',
                         )}
                    >
                         {open ? (
                              <X aria-hidden className="size-6" />
                         ) : (
                              <>
                                   {/* Soft pulse while the greeting is showing */}
                                   {greeting && (
                                        <span
                                             aria-hidden
                                             className="absolute inset-0 rounded-full bg-brand-500/40 motion-safe:animate-ping"
                                        />
                                   )}
                                   <LogoMark tile title="" className="relative size-10" />
                                   <span
                                        aria-hidden
                                        className="absolute top-0.5 right-0.5 size-3.5 rounded-full bg-success ring-2 ring-white"
                                   />
                              </>
                         )}
                    </button>
               </div>
          </div>
     )
}

function Avatar({ className }: { className?: string }) {
     return (
          <span
               className={cn(
                    'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-700',
                    className,
               )}
          >
               <LogoMark tile title="" className="size-full" />
          </span>
     )
}

function BotBubble({
     text,
     action,
     onAction,
}: {
     text: string
     action?: Message['action']
     onAction?: () => void
}) {
     const external = action?.href.startsWith('http')
     return (
          <div className="flex items-end gap-2">
               <Avatar className="size-7" />
               <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-paper px-3.5 py-2.5 text-sm leading-relaxed text-ink">
                    <p>{text}</p>
                    {action && (
                         <a
                              href={action.href}
                              {...(external
                                   ? { target: '_blank', rel: 'noopener noreferrer' }
                                   : {})}
                              // In-page link (#pricing): close the chat so the section is visible
                              onClick={action.href.startsWith('#') ? onAction : undefined}
                              className="mt-2 inline-flex h-9 items-center rounded-lg border border-line bg-white px-3 text-xs font-semibold text-brand-700 hover:border-brand-300"
                         >
                              {action.label} →
                         </a>
                    )}
               </div>
          </div>
     )
}
