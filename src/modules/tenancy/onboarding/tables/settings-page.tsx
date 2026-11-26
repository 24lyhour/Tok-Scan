import { TranslationsProvider } from '@/i18n/provider'
import { getTranslations } from '@/i18n/server'
import { Card } from '@/shared/components/ui/card'

import { getOnboardingContext } from '../server/context'
import { TablesForm } from './form'
import { tablesFormProps } from './form-props'

/**
 * Tables inside the app (/tables, sidebar → Tables): the same form as onboarding step 4,
 * without the checklist, saving back to this page. The app layout adds sidebar + title.
 */
export async function TablesSettingsPage() {
     const ctx = await getOnboardingContext()
     const { m } = await getTranslations('onboarding')

     return (
          <TranslationsProvider namespaces={['onboarding']}>
               <Card className="mx-auto max-w-xl gap-0 rounded-3xl px-5 py-6 ring-line sm:px-8">
                    <p className="mb-6 text-sm text-ink-3">{m.tables.subtitle}</p>
                    <TablesForm
                         {...await tablesFormProps(ctx)}
                         submitLabel={m.tables.save}
                         returnTo="tables"
                    />
               </Card>
          </TranslationsProvider>
     )
}
