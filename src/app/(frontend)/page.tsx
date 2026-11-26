import type { Metadata } from 'next'

import { getTranslations } from '@/i18n/server'
import { LandingPage } from '@/modules/marketing'

export async function generateMetadata(): Promise<Metadata> {
     const { t } = await getTranslations('landing')
     return { title: { absolute: t('meta.title') }, description: t('meta.description') }
}

export default function HomePage() {
     return <LandingPage />
}
