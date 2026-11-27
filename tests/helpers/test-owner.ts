/**
 * A throwaway restaurant owner for e2e tests: removes any earlier run's data, then creates a
 * fresh account with no organization (so onboarding starts at step 2).
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

export const testOwner = {
     email: 'e2e-owner@test.tok-scan.local',
     password: 'e2e-password-123',
     name: 'E2E Owner',
}

export async function resetTestOwner(): Promise<void> {
     const payload = await getPayload({ config: await config })
     const old = await payload.find({
          collection: 'users',
          where: { email: { equals: testOwner.email } },
          overrideAccess: true,
          depth: 0,
     })
     for (const user of old.docs) {
          const orgs = await payload.find({
               collection: 'organizations',
               where: { owner: { equals: user.id } },
               overrideAccess: true,
               depth: 0,
          })
          const orgIds = orgs.docs.map((o) => o.id)
          // users.tenants → organization and organization.owner → user: unlink first
          await payload.update({
               collection: 'users',
               id: user.id,
               data: { tenants: [] },
               overrideAccess: true,
          })
          if (orgIds.length) {
               for (const collection of ['tables', 'outlets', 'media'] as const) {
                    await payload.delete({
                         collection,
                         where: { tenant: { in: orgIds } },
                         overrideAccess: true,
                    })
               }
               await payload.delete({
                    collection: 'organizations',
                    where: { id: { in: orgIds } },
                    overrideAccess: true,
               })
          }
          await payload.delete({ collection: 'users', id: user.id, overrideAccess: true })
     }
     await payload.create({ collection: 'users', data: testOwner, overrideAccess: true })
}

export const testSuperAdmin = {
     email: 'e2e-admin@test.tok-scan.local',
     password: 'e2e-password-123',
     name: 'E2E Platform Admin',
     /** tok-scan staff have their own table */
     collection: 'admins' as const,
}

/** A tok-scan staff account (the `admins` table) for console tests — created once, reused. */
export async function ensureTestSuperAdmin(): Promise<void> {
     const payload = await getPayload({ config: await config })
     // Staff live only in `admins`: remove an old owner account with the same email (older runs)
     await payload.delete({
          collection: 'users',
          where: { email: { equals: testSuperAdmin.email } },
          overrideAccess: true,
     })
     const { docs } = await payload.find({
          collection: 'admins',
          where: { email: { equals: testSuperAdmin.email } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
     })
     if (docs[0]) {
          await payload.update({
               collection: 'admins',
               id: docs[0].id,
               data: { password: testSuperAdmin.password },
               overrideAccess: true,
          })
     } else {
          const { email, password, name } = testSuperAdmin
          await payload.create({
               collection: 'admins',
               data: { email, password, name },
               overrideAccess: true,
          })
     }
}

export const testPendingOrg = { name: 'E2E Pending Cafe', slug: 'e2e-pending-cafe', code: 'E2EPND' }

/**
 * A restaurant waiting for approval, owned by the test owner (so resetTestOwner() removes it).
 * Call after resetTestOwner().
 */
export async function createTestPendingOrg(): Promise<void> {
     const payload = await getPayload({ config: await config })
     const { docs } = await payload.find({
          collection: 'users',
          where: { email: { equals: testOwner.email } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
     })
     const owner = docs[0]
     if (!owner) throw new Error('Run resetTestOwner() first')
     await payload.create({
          collection: 'organizations',
          data: { ...testPendingOrg, owner: owner.id, status: 'pending_approval' },
          overrideAccess: true,
     })
}
