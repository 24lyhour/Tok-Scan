import type { Metadata } from 'next'

import { TablesSettingsPage, tablesMetadata } from '@/modules/tenancy'

export const generateMetadata = (): Promise<Metadata> => tablesMetadata()

export default TablesSettingsPage
