/**
 * Organization web address rules: tok-scan.store/r/<slug>  (Module 14 §3.1, §6.3).
 * Pure functions — shared by the onboarding form (client) and the server.
 */

export const SLUG_MIN = 3
export const SLUG_MAX = 40

/** Lower-case letters/digits, single hyphens between them. */
export const SLUG_PATTERN = /^[a-z0-9](?:-?[a-z0-9])*$/

/** Paths the app already uses or may use — never allowed as an organization address. */
export const RESERVED_SLUGS = new Set([
     'admin',
     'api',
     'app',
     'r',
     't',
     'www',
     'auth',
     'login',
     'logout',
     'signup',
     'onboarding',
     'invite',
     'settings',
     'static',
     '_next',
     'tok-scan',
     'tokscan',
     'support',
     'help',
     'docs',
     'status',
     'dashboard',
     'console',
     'billing',
     'pricing',
     'terms',
     'privacy',
     'blog',
])

export type SlugProblem = 'tooShort' | 'tooLong' | 'invalid' | 'reserved' | 'taken'

/** "Mahob Kitchen & Bar!" → "mahob-kitchen-bar" (Latin only; Khmer/Chinese names → type your own). */
export function slugify(input: string): string {
     return input
          .normalize('NFKD')
          .replace(/[̀-ͯ]/g, '')
          .toLowerCase()
          .replace(/&/g, ' and ')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .replace(/-{2,}/g, '-')
          .slice(0, SLUG_MAX)
          .replace(/-+$/g, '')
}

/** Format checks only (availability is checked on the server). */
export function checkSlugFormat(slug: string): SlugProblem | null {
     if (slug.length < SLUG_MIN) return 'tooShort'
     if (slug.length > SLUG_MAX) return 'tooLong'
     if (!SLUG_PATTERN.test(slug)) return 'invalid'
     if (RESERVED_SLUGS.has(slug)) return 'reserved'
     return null
}

/**
 * Short uppercase code for document numbers (INV-MHB-2611-00482): initials or first consonants,
 * 3 letters. Uniqueness is ensured by the caller (adds a digit when taken).
 */
export function baseOrgCode(name: string): string {
     const words = name
          .normalize('NFKD')
          .toUpperCase()
          .replace(/[^A-Z0-9 ]+/g, ' ')
          .split(/\s+/)
          .filter(Boolean)
     if (words.length === 0) return 'ORG'
     if (words.length >= 3)
          return words
               .slice(0, 3)
               .map((w) => w[0])
               .join('')
     const first = words[0]!
     const consonants = first[0] + first.slice(1).replace(/[AEIOU]/g, '')
     const pool =
          words.length === 2
               ? first[0] + (words[1]![0] ?? '') + consonants.slice(1)
               : consonants + first
     return pool.slice(0, 3).padEnd(3, 'X')
}

/**
 * Alternatives to offer when an address is taken, reserved or too short:
 * "mahob" (café) → mahob-cafe, mahob-kh, mahob-pp, mahob-official, mahob-2, mahob-3.
 * Only well-formed candidates; the server removes the ones already taken.
 */
export function slugCandidates(slug: string, businessType?: string): string[] {
     const root = slug.slice(0, SLUG_MAX - 9).replace(/-+$/g, '')
     if (!root) return []
     const endings = [businessType ? slugify(businessType) : '', 'kh', 'pp', 'official', '2', '3']
     const candidates = endings.filter(Boolean).map((ending) => `${root}-${ending}`)
     return [...new Set(candidates)].filter((c) => c !== slug && !checkSlugFormat(c))
}
