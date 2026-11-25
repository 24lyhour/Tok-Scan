import type { Metadata, Viewport } from 'next'
import { Inter, Kantumruy_Pro } from 'next/font/google'
import React from 'react'

import './styles.css'

// Inter (with optical sizing so large headings render like Inter Display) + Khmer fallback — guide p.03
const inter = Inter({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-inter',
  display: 'swap',
})

const khmer = Kantumruy_Pro({
  subsets: ['khmer'],
  variable: '--font-kantumruy',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'tok·scan — QR ordering & billing for Cambodian restaurants',
    template: '%s · tok·scan',
  },
  description:
    'Guests order from their phone, the kitchen sees it instantly, and bills are paid by KHQR. One restaurant or twenty outlets.',
  applicationName: 'tok-scan',
}

export const viewport: Viewport = {
  themeColor: '#0b2e24',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${khmer.variable}`}>
      <body>{children}</body>
    </html>
  )
}
