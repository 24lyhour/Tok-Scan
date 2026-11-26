import type { Metadata } from 'next'

import { LoginPage, loginMetadata } from '@/modules/tenancy'

export const generateMetadata = (): Promise<Metadata> => loginMetadata()

export default LoginPage
