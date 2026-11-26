/**
 * Access rules against real Payload + Postgres (core/access.ts + multi-tenant plugin).
 *   Restaurant A: ownerA (owner), staffA (member)   ·   Restaurant B: ownerB (owner)
 * Creates its own data with a unique suffix and removes it afterwards.
 */
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { Users } from '@/modules/tenancy/payload'
import type { Organization, Outlet, Table, User } from '@/payload-types'

const run = Date.now().toString(36)
let payload: Payload
let orgA: Organization, orgB: Organization
let ownerA: User, staffA: User, ownerB: User, platformAdmin: User
let outletA: Outlet, outletB: Outlet, tableA: Table

/** Payload's "not allowed" (Forbidden) or "not found" (hidden by access rules) — never a validation error */
const DENIED = /not allowed|not found/i

/** Local API call made AS this user, with access rules on */
const as = (user: User) => ({
     user: { ...user, collection: 'users' as const },
     overrideAccess: false,
})

async function makeUser(name: string) {
     return payload.create({
          collection: 'users',
          data: {
               email: `${name}-${run}@test.tok-scan.local`,
               password: 'test-password-123',
               name,
          },
          overrideAccess: true,
     })
}
async function makeOrg(key: string, owner: User) {
     return payload.create({
          collection: 'organizations',
          data: {
               name: `IT ${key} ${run}`,
               slug: `it-${key}-${run}`,
               code: `T${key}${run}`.slice(0, 6).toUpperCase(),
               owner: owner.id,
          },
          overrideAccess: true,
     })
}
async function join(user: User, org: Organization, orgRole: 'owner' | 'admin' | 'member') {
     return payload.update({
          collection: 'users',
          id: user.id,
          data: { tenants: [{ tenant: org.id, orgRole }] },
          overrideAccess: true,
          depth: 0,
     })
}

beforeAll(async () => {
     payload = await getPayload({ config: await config })
     ;[ownerA, staffA, ownerB, platformAdmin] = await Promise.all([
          makeUser('owner-a'),
          makeUser('staff-a'),
          makeUser('owner-b'),
          makeUser('platform-admin'),
     ])
     platformAdmin = await payload.update({
          collection: 'users',
          id: platformAdmin.id,
          data: { platformRole: 'super-admin' },
          overrideAccess: true,
     })
     orgA = await makeOrg('a', ownerA)
     orgB = await makeOrg('b', ownerB)
     ownerA = await join(ownerA, orgA, 'owner')
     staffA = await join(staffA, orgA, 'member')
     ownerB = await join(ownerB, orgB, 'owner')
     outletA = await payload.create({
          collection: 'outlets',
          data: { name: 'A1', tenant: orgA.id },
          overrideAccess: true,
     })
     outletB = await payload.create({
          collection: 'outlets',
          data: { name: 'B1', tenant: orgB.id },
          overrideAccess: true,
     })
     tableA = await payload.create({
          collection: 'tables',
          data: { tenant: orgA.id, outlet: outletA.id, number: 1, label: 'T01', qrKey: 'testkey1' },
          overrideAccess: true,
     })
})

afterAll(async () => {
     if (!payload) return
     const orgs = [orgA, orgB].filter(Boolean).map((o) => o.id)
     await payload.delete({
          collection: 'tables',
          where: { tenant: { in: orgs } },
          overrideAccess: true,
     })
     await payload.delete({
          collection: 'outlets',
          where: { tenant: { in: orgs } },
          overrideAccess: true,
     })
     const users = [ownerA, staffA, ownerB, platformAdmin].filter(Boolean)
     // users.tenants → organization and organization.owner → user: unlink first
     for (const u of users) {
          await payload.update({
               collection: 'users',
               id: u.id,
               data: { tenants: [] },
               overrideAccess: true,
          })
     }
     await payload.delete({
          collection: 'organizations',
          where: { id: { in: orgs } },
          overrideAccess: true,
     })
     await payload.delete({
          collection: 'users',
          where: { id: { in: users.map((u) => u.id) } },
          overrideAccess: true,
     })
})

describe('restaurants are isolated', () => {
     it('an owner only sees their own outlets', async () => {
          const { docs } = await payload.find({ collection: 'outlets', ...as(ownerA), depth: 0 })
          const ids = docs.map((d) => d.id)
          expect(ids).toContain(outletA.id)
          expect(ids).not.toContain(outletB.id)
     })

     it("an owner can't change another restaurant", async () => {
          await expect(
               payload.update({
                    collection: 'organizations',
                    id: orgB.id,
                    data: { name: 'hacked' },
                    ...as(ownerA),
               }),
          ).rejects.toThrow(DENIED)
          await expect(
               payload.create({
                    collection: 'tables',
                    data: {
                         tenant: orgB.id,
                         outlet: outletB.id,
                         number: 9,
                         label: 'T09',
                         qrKey: 'x',
                    },
                    ...as(ownerA),
               }),
               // Stopped first by the plugin (tenant must be one of yours), then by requireTenantManager
          ).rejects.toThrow(/not allowed|invalid: tenant/i)
     })
})

describe('roles inside a restaurant', () => {
     it('staff can read setup', async () => {
          const { docs } = await payload.find({ collection: 'tables', ...as(staffA), depth: 0 })
          expect(docs.map((d) => d.id)).toContain(tableA.id)
     })

     it("staff can't change the restaurant, its tables or outlets", async () => {
          await expect(
               payload.update({
                    collection: 'organizations',
                    id: orgA.id,
                    data: { name: 'x' },
                    ...as(staffA),
               }),
          ).rejects.toThrow(DENIED)
          await expect(
               payload.update({
                    collection: 'tables',
                    id: tableA.id,
                    data: { zone: 'x' },
                    ...as(staffA),
               }),
          ).rejects.toThrow(DENIED)
          await expect(
               payload.delete({ collection: 'tables', id: tableA.id, ...as(staffA) }),
          ).rejects.toThrow(DENIED)
          await expect(
               payload.create({
                    collection: 'outlets',
                    data: { name: 'x', tenant: orgA.id },
                    ...as(staffA),
               }),
          ).rejects.toThrow(DENIED)
     })

     it('the owner can', async () => {
          const org = await payload.update({
               collection: 'organizations',
               id: orgA.id,
               data: { name: `IT a ${run} renamed` },
               ...as(ownerA),
          })
          expect(org.name).toContain('renamed')
          const table = await payload.update({
               collection: 'tables',
               id: tableA.id,
               data: { zone: 'Terrace' },
               ...as(ownerA),
          })
          expect(table.zone).toBe('Terrace')
     })
})

describe('accounts', () => {
     it("staff can't change the owner's account", async () => {
          await expect(
               payload.update({
                    collection: 'users',
                    id: ownerA.id,
                    data: { email: `x-${run}@evil.local` },
                    ...as(staffA),
               }),
          ).rejects.toThrow(DENIED)
     })

     it('staff can edit their own profile but not their own role', async () => {
          await payload.update({
               collection: 'users',
               id: staffA.id,
               data: {
                    name: 'Staff renamed',
                    tenants: [{ tenant: orgA.id, orgRole: 'owner' }],
                    platformRole: 'super-admin',
               },
               ...as(staffA),
          })
          const fresh = await payload.findByID({
               collection: 'users',
               id: staffA.id,
               depth: 0,
               overrideAccess: true,
          })
          expect(fresh.name).toBe('Staff renamed')
          expect(fresh.tenants?.[0]?.orgRole).toBe('member')
          expect(fresh.platformRole).not.toBe('super-admin')
     })
})

describe('super-admin console (Payload admin)', () => {
     const canOpenAdmin = (user: User) =>
          (Users.access!.admin as (args: unknown) => boolean)({ req: { user } })

     it('only tok-scan staff can open /admin', () => {
          expect(canOpenAdmin(platformAdmin)).toBe(true)
          expect(canOpenAdmin(ownerA)).toBe(false)
          expect(canOpenAdmin(staffA)).toBe(false)
     })

     it('approving a restaurant records who did it', async () => {
          await payload.update({
               collection: 'organizations',
               id: orgB.id,
               data: { status: 'pending_approval' },
               overrideAccess: true,
          })
          const approved = await payload.update({
               collection: 'organizations',
               id: orgB.id,
               data: { status: 'active' },
               ...as(platformAdmin),
               depth: 0,
          })
          expect(approved.status).toBe('active')
          expect(approved.statusChangedBy).toBe(platformAdmin.id)
          expect(approved.statusChangedAt).toBeTruthy()
     })

     it("owners can't approve themselves", async () => {
          const result = await payload.update({
               collection: 'organizations',
               id: orgA.id,
               data: { status: 'active', statusChangedBy: ownerA.id },
               ...as(ownerA),
               depth: 0,
          })
          // Field access silently ignores both values
          expect(result.status).not.toBe('active')
          expect(result.statusChangedBy ?? null).toBeNull()
     })
})
