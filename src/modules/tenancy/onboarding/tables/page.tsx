import { getTranslations } from '@/i18n/server'

import { StepPage, stepMetadata } from '../components/step-page'
import { goLiveRows } from '../go-live/checklist'
import { ChecklistCard } from '../go-live/checklist-card'
import { requireStep } from '../server/context'
import { TablesForm } from './form'
import { tablesFormProps } from './form-props'

/** Onboarding step 4 of 4 — tables, QR previews and the go-live checklist (guide p.23). */
export async function TablesStepPage() {
     const ctx = await requireStep('tables')
     const { m, locale } = await getTranslations('onboarding')
     const common = (await getTranslations('common', locale)).m

     return (
          <StepPage step={4} section="tables">
               <TablesForm
                    {...await tablesFormProps(ctx)}
                    checklist={
                         <ChecklistCard
                              compact
                              rows={goLiveRows(ctx)}
                              title={m.tables.checklistTitle}
                              m={m.goLive}
                              soonLabel={common.states.soon}
                              locale={locale}
                         />
                    }
               />
          </StepPage>
     )
}

export const tablesMetadata = stepMetadata('tables')
