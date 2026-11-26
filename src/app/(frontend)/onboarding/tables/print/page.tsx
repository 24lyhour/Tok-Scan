import type { Metadata } from 'next'

import { printQrMetadata, PrintQrPage } from '@/modules/tenancy'

export const generateMetadata = (): Promise<Metadata> => printQrMetadata()

export default PrintQrPage
