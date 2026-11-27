'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { getCurrentUser, type OrgStatus } from '@/modules/tenancy'
import { CONSOLE_ROUTES } from '@/shared/config/app-routes'

import { ACTION_TARGET, STATUS_ACTIONS, type StatusAction } from './query'

export type StatusChangeResult =
     { ok: true } | { ok: false; error: 'generic' | 'forbidden' | 'notAllowed' }

const input = z.object({
     id: z.number().int().positive(),
     action: z.enum(Object.keys(ACTION_TARGET) as [StatusAction, ...StatusAction[]]),
})

/**
 * Approve / suspend / reactivate a restaurant (guide p.27). Super-admin only, only the changes
 * STATUS_ACTIONS allows. Runs with the signed-in user (not overrideAccess), so Payload's access
 * rules apply and the organizations hook records who changed the status and when.
 */
export async function changeOrgStatus(raw: {
     id: number
     action: StatusAction
}): Promise<StatusChangeResult> {
     const parsed = input.safeParse(raw)
     if (!parsed.success) return { ok: false, error: 'generic' }
     const { id, action } = parsed.data

     const { payload, staff } = await getCurrentUser()
     if (!staff) return { ok: false, error: 'forbidden' }

     const org = await payload
          .findByID({ collection: 'organizations', id, depth: 0, overrideAccess: true })
          .catch(() => null)
     if (!org) return { ok: false, error: 'generic' }
     if (!STATUS_ACTIONS[(org.status ?? 'trial') as OrgStatus].includes(action)) {
          return { ok: false, error: 'notAllowed' }
     }

     try {
          await payload.update({
               collection: 'organizations',
               id,
               data: { status: ACTION_TARGET[action] },
               user: staff,
               overrideAccess: false,
          })
     } catch (error) {
          payload.logger.error({ err: error, msg: 'Console status change failed' })
          return { ok: false, error: 'generic' }
     }

     revalidatePath(CONSOLE_ROUTES.home, 'layout')
     return { ok: true }
}
