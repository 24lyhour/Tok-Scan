import type { Metadata } from 'next'

import { SignupPage, signupMetadata } from '@/modules/tenancy'

export const generateMetadata = (): Promise<Metadata> => signupMetadata()

export default SignupPage
