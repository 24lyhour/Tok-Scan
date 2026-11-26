import type { OnboardingContent } from '@/i18n/messages'
import { APP_ROUTES } from '@/shared/config/app-routes'

import { onboardingRoutes } from '../routes'
import type { OnboardingContext } from '../server/context'

/** "Get <restaurant> live" checklist (guide p.22) — in order. */
export const GO_LIVE_ITEMS = [
     'organization',
     'outlet',
     'tables',
     'menu',
     'payments',
     'staff',
] as const
export type GoLiveItem = (typeof GO_LIVE_ITEMS)[number]

/** Where each finished item can be edited. */
export const GO_LIVE_LINKS: Partial<Record<GoLiveItem, string>> = {
     organization: onboardingRoutes.organization,
     outlet: onboardingRoutes.outlet,
     tables: APP_ROUTES.tables,
}

/** Button shown for items whose module isn't built yet (Menu, Payments, Staff). */
type ActionKey = keyof OnboardingContent['goLive']['actions']

export const GO_LIVE_ACTIONS: Partial<Record<GoLiveItem, ActionKey>> = {
     menu: 'importCsv',
     payments: 'connect',
     staff: 'invite',
}

export type GoLiveRow = { id: GoLiveItem; done: boolean; href?: string; action?: ActionKey }

/** Rows with done/undone state for this owner. TODO: menu, payments, staff once those modules exist. */
export function goLiveRows(
     ctx: Pick<OnboardingContext, 'organization' | 'outlet' | 'tables'>,
): GoLiveRow[] {
     const done: Record<GoLiveItem, boolean> = {
          organization: Boolean(ctx.organization),
          outlet: Boolean(ctx.outlet),
          tables: ctx.tables.length > 0,
          menu: false,
          payments: false,
          staff: false,
     }
     return GO_LIVE_ITEMS.map((id) => ({
          id,
          done: done[id],
          href: GO_LIVE_LINKS[id],
          action: GO_LIVE_ACTIONS[id],
     }))
}

/**
 * Table QR codes are printed only once the menu exists — otherwise a guest who scans one lands on
 * an empty page. (The menu module isn't built yet, so for now this stays false.)
 */
export function canPrintQr(rows: GoLiveRow[]): boolean {
     const done = (id: GoLiveItem) => rows.some((r) => r.id === id && r.done)
     return done('tables') && done('menu')
}
