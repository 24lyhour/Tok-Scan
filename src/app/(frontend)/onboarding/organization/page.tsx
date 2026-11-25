import type { Metadata } from 'next'

import { organizationMetadata, OrganizationStepPage } from '@/modules/tenancy/onboarding'

export const generateMetadata = (): Promise<Metadata> => organizationMetadata()

export default OrganizationStepPage
