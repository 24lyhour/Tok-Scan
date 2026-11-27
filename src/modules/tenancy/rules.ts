/**
 * BROWSER-SAFE entry: validation rules and constants only (pure — no server code), for client
 * forms in other modules, e.g. the console's Edit organization. Server code imports
 * `@/modules/tenancy` as usual.
 */
export {
     BUSINESS_TYPES,
     type BusinessType,
     ORGANIZATION_LIMITS,
} from './collections/organizations/constants'
export type { OnboardingErrorCode } from './onboarding/errors'
export {
     dropStaleOtherType,
     organizationCoreFields,
     requireOtherType,
} from './onboarding/organization/schema'
export { NAME_MAX } from './onboarding/signup/schema'
