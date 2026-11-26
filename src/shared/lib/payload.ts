import type { CollectionSlug, Payload, Where } from 'payload'

/**
 * Small Payload helpers for tenancy server code (actions, pages).
 * They run with overrideAccess: callers are trusted server code that already checked the user.
 */

/** Is there at least one document matching `where`? */
export async function exists(payload: Payload, collection: CollectionSlug, where: Where) {
     const { totalDocs } = await payload.count({ collection, where, overrideAccess: true })
     return totalDocs > 0
}

/** A unique-index violation on `field` (e.g. two sign-ups racing for the same email). */
export function isUniqueError(error: unknown, field: string): boolean {
     const message = error instanceof Error ? error.message : ''
     return (
          new RegExp(field, 'i').test(message) &&
          /(unique|already|duplicate|registered)/i.test(message)
     )
}

/** Id of a relationship value, whether it was populated or not. */
export function relationId<T extends { id: number }>(value: number | T | null | undefined) {
     return typeof value === 'object' && value !== null ? value.id : (value ?? undefined)
}
