import type { Metadata } from 'next'

import { tablesMetadata, TablesStepPage } from '@/modules/tenancy'

export const generateMetadata = (): Promise<Metadata> => tablesMetadata()

export default TablesStepPage
