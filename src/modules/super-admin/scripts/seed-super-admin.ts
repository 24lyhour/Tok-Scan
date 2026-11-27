/**
 * Seed a tok-scan staff login (the `admins` table — separate from restaurant owners):
 *   yarn seed:admin
 * Reads SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD (and optional SEED_ADMIN_NAME) from .env — never
 * commit real values. Creates the staff account, or resets its password if it already exists.
 * Safe to run again. Log in at /admin/login.
 *
 * Only runs against a local database unless you pass --remote (use a strong password there).
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.SEED_ADMIN_PASSWORD
const name = process.env.SEED_ADMIN_NAME?.trim() || 'tok-scan admin'

if (!email || !password) {
     console.error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env, then run yarn seed:admin')
     process.exit(1)
}

const dbHost = (() => {
     try {
          return new URL(process.env.DATABASE_URL ?? '').hostname
     } catch {
          return ''
     }
})()
const isLocal = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(dbHost)
if (!isLocal && !process.argv.includes('--remote')) {
     console.error(
          `Refusing to seed a non-local database (${dbHost || 'unknown host'}). Use --remote to override.`,
     )
     process.exit(1)
}

const payload = await getPayload({ config })
const { docs } = await payload.find({
     collection: 'admins',
     where: { email: { equals: email } },
     limit: 1,
     depth: 0,
     overrideAccess: true,
})
const existing = docs[0]

if (existing) {
     await payload.update({
          collection: 'admins',
          id: existing.id,
          data: { password },
          overrideAccess: true,
     })
     console.log(`Updated staff account ${email}: password reset from SEED_ADMIN_PASSWORD.`)
} else {
     await payload.create({
          collection: 'admins',
          data: { email, password, name },
          overrideAccess: true,
     })
     console.log(`Created staff account ${email}.`)
}
console.log('Log in at /admin/login.')
process.exit(0)
