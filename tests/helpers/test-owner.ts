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
}

/** A tok-scan staff account (platformRole super-admin) for console tests — created once, reused. */
export async function ensureTestSuperAdmin(): Promise<void> {
     const payload = await getPayload({ config: await config })
     const { docs } = await payload.find({
          collection: 'users',
          where: { email: { equals: testSuperAdmin.email } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
     })
     if (docs[0]) {
          await payload.update({
               collection: 'users',
               id: docs[0].id,
               data: { platformRole: 'super-admin', password: testSuperAdmin.password },
               overrideAccess: true,
          })
     } else {
          await payload.create({
               collection: 'users',
               data: { ...testSuperAdmin, platformRole: 'super-admin' },
               overrideAccess: true,
          })
     }
}
