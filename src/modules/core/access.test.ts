import { afterEach, describe, expect, it, vi } from 'vitest'

import {
     isSuperAdmin,
     orgIdsWithRole,
     orgManagersUpdate,
     requireTenantManager,
     selfOrSuperAdmin,
     tenantManagers,
     tenantManagersCreate,
     tenantMembers,
} from './access'

// Organization 1: owner · Organization 2: member
const owner = {
     id: 10,
     tenants: [
          { tenant: 1, orgRole: 'owner' },
          { tenant: { id: 2 }, orgRole: 'member' },
     ],
}
const staff = { id: 11, tenants: [{ tenant: 1, orgRole: 'member' }] }
const superAdmin = { id: 1, platformRole: 'super-admin', tenants: [] }

// Access functions only read `req.user` (and `req.t` for errors)
type AnyArgs = Parameters<typeof tenantManagers>[0]
const as = (user: unknown) => ({ req: { user, t: (k: string) => k } }) as unknown as AnyArgs

describe('roles', () => {
     it('reads organization ids by role, populated or not', () => {
          expect(orgIdsWithRole(owner)).toEqual([1, 2])
          expect(orgIdsWithRole(owner, ['owner', 'admin'])).toEqual([1])
          expect(orgIdsWithRole(null)).toEqual([])
     })

     it('knows tok-scan staff', () => {
          expect(isSuperAdmin(superAdmin)).toBe(true)
          expect(isSuperAdmin(owner)).toBe(false)
     })

     describe('SUPER_ADMIN_EMAILS', () => {
          afterEach(() => vi.unstubAllEnvs())

          it('makes listed emails staff (any case, spaces ignored)', () => {
               vi.stubEnv('SUPER_ADMIN_EMAILS', ' Boss@Tok-Scan.store , ops@tok-scan.store')
               expect(isSuperAdmin({ ...owner, email: 'boss@tok-scan.store' })).toBe(true)
               expect(isSuperAdmin({ ...owner, email: 'OPS@tok-scan.store' })).toBe(true)
               expect(isSuperAdmin({ ...owner, email: 'someone@tok-scan.store' })).toBe(false)
          })

          it('gives nothing when empty or the user has no email', () => {
               vi.stubEnv('SUPER_ADMIN_EMAILS', '')
               expect(isSuperAdmin({ ...owner, email: '' })).toBe(false)
               vi.stubEnv('SUPER_ADMIN_EMAILS', ' , ')
               expect(isSuperAdmin({ ...owner, email: '' })).toBe(false)
               expect(isSuperAdmin(null)).toBe(false)
          })
     })
})

describe('tenant-scoped rules', () => {
     it('members read their organizations', () => {
          expect(tenantMembers(as(owner))).toEqual({ tenant: { in: [1, 2] } })
          expect(tenantMembers(as(null))).toBe(false)
     })

     it('only owners/admins change data', () => {
          expect(tenantManagers(as(owner))).toEqual({ tenant: { in: [1] } })
          expect(tenantManagers(as(staff))).toBe(false)
          expect(tenantManagers(as(superAdmin))).toBe(true)
          expect(tenantManagersCreate(as(staff))).toBe(false)
          expect(tenantManagersCreate(as(owner))).toBe(true)
     })

     it('organizations: managers update, members do not', () => {
          expect(orgManagersUpdate(as(owner))).toEqual({ id: { in: [1] } })
          expect(orgManagersUpdate(as(staff))).toBe(false)
     })

     it('users: only yourself (or super-admin)', () => {
          expect(selfOrSuperAdmin(as(staff))).toEqual({ id: { equals: 11 } })
          expect(selfOrSuperAdmin(as(superAdmin))).toBe(true)
     })
})

describe('requireTenantManager hook', () => {
     const run = (user: unknown, tenant: unknown) =>
          requireTenantManager({
               req: { user, t: (k: string) => k },
               data: { tenant },
               operation: 'create',
          } as unknown as Parameters<typeof requireTenantManager>[0])

     it('lets owners write in their own organization', () => {
          expect(run(owner, 1)).toEqual({ tenant: 1 })
     })

     it('blocks writing into an organization you only work in, or do not belong to', () => {
          expect(() => run(owner, 2)).toThrow()
          expect(() => run(owner, 99)).toThrow()
          expect(() => run(staff, 1)).toThrow()
     })

     it('does not block server code (no user) or super-admins', () => {
          expect(run(undefined, 99)).toEqual({ tenant: 99 })
          expect(run(superAdmin, 99)).toEqual({ tenant: 99 })
     })
})
