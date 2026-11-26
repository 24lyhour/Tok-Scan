/**
 * Make an existing account tok-scan staff (super-admin):
 *   yarn super-admin you@example.com
 * Uses DATABASE_URL from your environment — local by default. The account must exist (sign up first).
 * The first super-admin can only be made this way (or with SQL); after that, super-admins can
 * promote others in /admin → Users → "Platform role".
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const email = process.argv
     .slice(2)
     .find((arg) => arg.includes('@'))
     ?.trim()
     .toLowerCase()

if (!email) {
     console.error('Usage: yarn super-admin you@example.com')
     process.exit(1)
}

const payload = await getPayload({ config })
const { docs } = await payload.find({
     collection: 'users',
     where: { email: { equals: email } },
     limit: 1,
     depth: 0,
     overrideAccess: true,
})
const user = docs[0]

if (!user) {
     console.error(`No account with ${email}. Sign up first, then run this again.`)
     process.exit(1)
}
if (user.platformRole === 'super-admin') {
     console.log(`${email} is already a super-admin.`)
     process.exit(0)
}

await payload.update({
     collection: 'users',
     id: user.id,
     data: { platformRole: 'super-admin' },
     overrideAccess: true,
})
console.log(`${email} is now a super-admin. Log out and back in, then open /admin.`)
process.exit(0)
