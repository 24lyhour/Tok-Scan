/**
 * Table QR codes — links and SVG drawing, shared by the onboarding preview, the print sheet and
 * later the table admin. Works on the server and in the browser.
 */
import QRCode from 'qrcode'

import { COLORS } from '@/shared/config/colors'

/** One look for every QR code: ink on white, medium error correction, small quiet zone. */
const QR_OPTIONS = {
     type: 'svg',
     margin: 1,
     errorCorrectionLevel: 'M',
     color: { dark: COLORS.ink, light: '#ffffff' },
} as const

/** QR code as an SVG string. */
export function qrSvg(value: string): Promise<string> {
     return QRCode.toString(value, QR_OPTIONS)
}

/** T01, T02 … T99, T100 */
export function tableLabel(n: number): string {
     return `T${String(n).padStart(2, '0')}`
}

/** 8-char URL-safe random key (Web Crypto: works on server and in the browser). */
export function newQrKey(): string {
     const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
     const bytes = crypto.getRandomValues(new Uint8Array(8))
     return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

/** https://tok-scan.store/r/mahob/t/T07?k=Q7x2abcd — what guests scan (guide p.20). */
export function buildTableQrUrl(
     origin: string,
     orgSlug: string,
     label: string,
     qrKey?: string,
): string {
     const url = new URL(`/r/${encodeURIComponent(orgSlug)}/t/${encodeURIComponent(label)}`, origin)
     if (qrKey) url.searchParams.set('k', qrKey)
     return url.toString()
}
