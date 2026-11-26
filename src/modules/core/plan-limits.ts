import { APIError, type CollectionBeforeChangeHook } from 'payload'

import { relationId } from '@/shared/lib/payload'

import { limitsFor, type LimitedResource } from './plans'

/**
 * Collection hook: refuse to create one more outlet/table than the organization's plan allows
 * (free trial: 1 outlet, 5 tables). Runs on every create — forms, the Payload admin and the REST /
 * GraphQL API — so the limit can't be skipped by calling the API directly.
 */
export function enforcePlanLimit(resource: Exclude<LimitedResource, 'staff'>) {
     const hook: CollectionBeforeChangeHook = async ({ operation, data, req }) => {
          if (operation !== 'create') return data
          const tenant = relationId(data?.tenant)
          if (!tenant) return data

          const organization = await req.payload
               .findByID({
                    collection: 'organizations',
                    id: tenant,
                    depth: 0,
                    overrideAccess: true,
                    req,
               })
               .catch(() => null)
          const limits = limitsFor(organization ?? undefined)
          if (!limits) return data

          const { totalDocs } = await req.payload.count({
               collection: resource,
               where: { tenant: { equals: tenant } },
               overrideAccess: true,
               req,
          })
          if (totalDocs >= limits[resource]) {
               throw new APIError(
                    `Plan limit reached: this plan allows up to ${limits[resource]} ${resource}.`,
                    403,
                    { resource, limit: limits[resource] },
                    true,
               )
          }
          return data
     }
     return hook
}
