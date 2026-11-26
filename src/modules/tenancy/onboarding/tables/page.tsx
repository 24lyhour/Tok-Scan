import { TABLE_DEFAULTS } from '@/modules/tables'
import { getTranslations } from '@/i18n/server'

import { StepPage, stepMetadata } from '../components/step-page'
import { goLiveRows } from '../go-live/checklist'
import { ChecklistCard } from '../go-live/checklist-card'
import { getPublicOrigin, maxTablesFor, requireStep } from '../server/context'
import { TablesForm } from './form'

/** First-time suggestion — fits every plan */
const DEFAULT_TABLE_COUNT = 10

/** Onboarding step 4 of 4 — tables, QR previews and the go-live checklist (guide p.23). */
export async function TablesStepPage() {
     const ctx = await requireStep('tables')
     const { m, locale } = await getTranslations('onboarding')
     const common = (await getTranslations('common')).m
     const { organization, tables } = ctx
     const maxTables = await maxTablesFor(ctx)

     return (
          <StepPage step={4} section="tables">
               <TablesForm
                    maxTables={maxTables}
                    initial={{
                         zone: tables[0]?.zone ?? TABLE_DEFAULTS.zone,
                         count: tables.length || Math.min(DEFAULT_TABLE_COUNT, maxTables),
                    }}
                    qr={{
                         origin: await getPublicOrigin(),
                         orgSlug: organization?.slug ?? '',
                         keys: Object.fromEntries(tables.map((t) => [t.number, t.qrKey])),
                    }}
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
