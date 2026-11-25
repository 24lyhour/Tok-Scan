import type { Metadata } from 'next'

import { SignupPage, signupMetadata } from '@/modules/tenancy/onboarding'

export const generateMetadata = (): Promise<Metadata> => signupMetadata()

export default SignupPage
