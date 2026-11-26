/** Outlet options, defaults and limits — plain values, safe to import in client forms. */
export const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type Weekday = (typeof WEEKDAYS)[number]

export const OUTLET_LIMITS = { name: 80, address: 200, vatTin: 30 } as const

/** New-outlet defaults — used by the collection AND the onboarding form, so they never drift. */
export const OUTLET_DEFAULTS = {
     exchangeRate: 4100,
     vatEnabled: true,
     vatPercent: 10,
     serviceChargeEnabled: true,
     serviceChargePercent: 5,
     lightingTaxEnabled: false,
     lightingTaxPercent: 3,
     days: [...WEEKDAYS] as Weekday[],
     opens: '10:00',
     closes: '22:00',
}
