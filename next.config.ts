import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/**
 * The one public address of the site, e.g. "tok-scan.store" (no https://, no www).
 * Set it on Vercel ONLY after the domain's DNS points to Vercel — otherwise these redirects would
 * send visitors from the working vercel.app address to a domain that doesn't serve the site yet.
 * Changing it needs a redeploy (redirects are built in at build time).
 */
const canonicalHost = process.env.CANONICAL_HOST?.trim().toLowerCase()

/** Other addresses that should permanently forward to the canonical one. */
const aliasHosts = canonicalHost ? ['tok-scans.vercel.app', `www.${canonicalHost}`] : []

const nextConfig: NextConfig = {
     // tok-scans.vercel.app/... and www.tok-scan.store/... → https://tok-scan.store/... (308, keeps the path)
     // Preview deployments have their own *.vercel.app addresses and are not affected.
     async redirects() {
          // One console for tok-scan staff: Payload's dashboard (/admin) opens /console instead.
          // Payload's record pages (/admin/collections/…) stay for editing raw data.
          const consoleHome = { source: '/admin', destination: '/console', permanent: false }
          if (!canonicalHost) return [consoleHome]
          return [
               consoleHome,
               ...aliasHosts.map((host) => ({
                    source: '/:path*',
                    has: [{ type: 'host' as const, value: host }],
                    destination: `https://${canonicalHost}/:path*`,
                    permanent: true,
               })),
          ]
     },
     images: {
          localPatterns: [
               {
                    pathname: '/api/media/file/**',
               },
          ],
          // With Payload's serverURL set, media URLs are absolute (https://tok-scan.store/api/media/file/…)
          remotePatterns: canonicalHost
               ? [{ protocol: 'https', hostname: canonicalHost, pathname: '/api/media/file/**' }]
               : [],
     },
     webpack: (webpackConfig) => {
          webpackConfig.resolve.extensionAlias = {
               '.cjs': ['.cts', '.cjs'],
               '.js': ['.ts', '.tsx', '.js', '.jsx'],
               '.mjs': ['.mts', '.mjs'],
          }

          return webpackConfig
     },
     turbopack: {
          root: path.resolve(dirname),
     },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
