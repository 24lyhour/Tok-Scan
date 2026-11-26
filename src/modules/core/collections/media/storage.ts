import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import type { Plugin } from 'payload'

/**
 * Where uploaded files (logos, menu photos) are stored.
 * Vercel's servers can't keep files on disk, so production uses Vercel Blob when
 * BLOB_READ_WRITE_TOKEN is set (Vercel → Storage → Blob → Connect adds it automatically).
 * Without the token (local dev) Payload saves to the local `media/` folder.
 */
export function mediaStorage(): Plugin {
     return vercelBlobStorage({
          enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
          collections: { media: true },
          token: process.env.BLOB_READ_WRITE_TOKEN ?? '',
     })
}
