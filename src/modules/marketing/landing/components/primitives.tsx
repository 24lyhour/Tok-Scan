import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

/** Max-width page column with the guide's 16px mobile gutter. */
export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)} {...props} />
}

/** Overline — 11 Semibold, tracked, saffron (guide p.03). */
export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn('text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-saffron-600', className)}>
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'center',
  className,
}: {
  eyebrow: string
  title: string
  body?: string
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-2xl text-center', className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-balance text-ink sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-base text-pretty text-ink-2 sm:text-lg">{body}</p>}
    </div>
  )
}

const ctaVariants = {
  /** Saffron with ink text — never white on saffron (guide p.02) */
  saffron: 'bg-saffron-500 text-ink hover:bg-saffron-600 focus-visible:ring-saffron-300',
  primary: 'bg-brand-700 text-white hover:bg-brand-800 focus-visible:ring-brand-300',
  outline: 'border border-line bg-white text-ink hover:bg-paper focus-visible:ring-brand-300',
  outlineLight: 'border border-white/30 text-white hover:bg-white/10 focus-visible:ring-white/40',
  ghostLight: 'text-white hover:bg-white/10 focus-visible:ring-white/40',
} as const

const ctaSizes = {
  sm: 'h-9 px-3.5 text-sm rounded-[0.625rem]',
  md: 'h-11 px-4 text-sm rounded-xl',
  lg: 'h-12 px-5 text-[0.9375rem] rounded-xl',
} as const

export type CtaVariant = keyof typeof ctaVariants

/** Link styled as a button. External links open in a new tab; in-page anchors use a plain <a>. */
export function CtaLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: {
  href: string
  variant?: CtaVariant
  size?: keyof typeof ctaSizes
  className?: string
  children: ReactNode
} & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>) {
  const classes = cn(
    'inline-flex shrink-0 items-center justify-center gap-2 font-semibold whitespace-nowrap transition-colors duration-[120ms] outline-none focus-visible:ring-3 [&_svg]:size-4 [&_svg]:shrink-0',
    ctaVariants[variant],
    ctaSizes[size],
    className,
  )

  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
      </a>
    )
  }
  if (href.startsWith('#')) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  )
}
