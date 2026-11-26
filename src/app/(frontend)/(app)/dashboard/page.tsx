import type { Metadata } from 'next'

import { DashboardPage, dashboardMetadata } from '@/modules/workspace'

export const generateMetadata = (): Promise<Metadata> => dashboardMetadata()

export default DashboardPage
