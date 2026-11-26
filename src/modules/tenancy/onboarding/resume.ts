import { redirect } from 'next/navigation'

import { STEP_PATHS } from './routes'
import { getOnboardingContext } from './server/context'

/** /onboarding — sends the owner to the step they are on (or the dashboard when finished). */
export async function ResumeOnboarding(): Promise<never> {
     const { step } = await getOnboardingContext()
     redirect(STEP_PATHS[step])
}
