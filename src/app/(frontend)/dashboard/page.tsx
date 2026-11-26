import type { Metadata } from 'next'

import { goLiveMetadata, GoLivePage } from '@/modules/tenancy'

export const generateMetadata = (): Promise<Metadata> => goLiveMetadata()

export default GoLivePage
