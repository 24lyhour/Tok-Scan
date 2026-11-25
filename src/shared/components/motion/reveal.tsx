'use client'

import { createElement, useEffect, useRef, useState, type HTMLAttributes } from 'react'

import { cn } from '@/shared/lib/utils'

type RevealProps = HTMLAttributes<HTMLElement> & {
     /** Element to render — use 'li' inside lists so markup stays valid */
     as?: 'div' | 'li' | 'section' | 'p'
     /** Stagger delay in ms (keep small: 0–300) */
     delay?: number
}

/**
 * Subtle scroll reveal: fade in + 16px rise, once, when the element enters the viewport.
 * - Skipped entirely for prefers-reduced-motion users.
 * - Without JavaScript the layout's <noscript> rule keeps content visible.
 * Motion timing follows the guide's "Status · 400 ms" / "Standard · ease-out" (p.28).
 */
export function Reveal({
     as = 'div',
     delay = 0,
     className,
     style,
     children,
     ...rest
}: RevealProps) {
     const ref = useRef<HTMLElement>(null)
     const [shown, setShown] = useState(false)

     useEffect(() => {
          const el = ref.current
          if (!el) return
          if (
               window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
               !('IntersectionObserver' in window)
          ) {
               setShown(true)
               return
          }
          const observer = new IntersectionObserver(
               ([entry]) => {
                    if (entry?.isIntersecting) {
                         setShown(true)
                         observer.disconnect()
                    }
               },
               { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
          )
          observer.observe(el)
          return () => observer.disconnect()
     }, [])

     return createElement(
          as,
          {
               ...rest,
               ref,
               'data-reveal': shown ? 'in' : 'out',
               className: cn(
                    'transition-[opacity,transform] duration-500 ease-out-soft motion-reduce:transition-none',
                    shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                    className,
               ),
               style: { ...style, transitionDelay: delay ? `${delay}ms` : undefined },
          },
          children,
     )
}
