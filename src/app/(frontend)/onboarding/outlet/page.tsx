import type { Metadata } from 'next'

import { outletMetadata, OutletStepPage } from '@/modules/tenancy'

export const generateMetadata = (): Promise<Metadata> => outletMetadata()

export default OutletStepPage
