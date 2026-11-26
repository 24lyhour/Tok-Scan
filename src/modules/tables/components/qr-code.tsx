'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/shared/lib/utils'

import { qrSvg } from '../qr'

/** Real, scannable QR code drawn in the browser (same look as the printed cards). */
export function QrCode({
     value,
     className,
     label,
}: {
     value: string
     className?: string
     label?: string
}) {
     const [svg, setSvg] = useState('')
     useEffect(() => {
          let alive = true
          qrSvg(value)
               .then((s) => alive && setSvg(s))
               .catch(() => alive && setSvg(''))
          return () => {
               alive = false
          }
     }, [value])
     return (
          <div
               role="img"
               aria-label={label ?? value}
               className={cn('aspect-square w-full bg-white [&_svg]:size-full', className)}
               // SVG made by the qrcode library from our own URL — no user HTML
               dangerouslySetInnerHTML={{ __html: svg }}
          />
     )
}
