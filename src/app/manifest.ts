import type { MetadataRoute } from 'next'

/** Web app manifest — icon and colours when tok-scan is added to a phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
     return {
          name: 'tok·scan',
          short_name: 'tok·scan',
          description: 'QR ordering, kitchen display and KHQR billing for restaurants.',
          start_url: '/',
          display: 'standalone',
          background_color: '#faf8f4',
          theme_color: '#0b2e24',
          icons: [
               { src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
               { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
               { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
          ],
     }
}
