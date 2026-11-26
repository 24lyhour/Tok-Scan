/**
 * Clock times as "HH:MM" (24 h) — the format forms post and the database stores.
 * "HH:MM" strings compare correctly as text ("09:30" < "22:00").
 */

/** "00:00", "00:30" … "23:30" — every `step` minutes, optionally only between `min` and `max` (inclusive). */
export function timeSlots(step = 30, range: { min?: string; max?: string } = {}): string[] {
     const all = Array.from({ length: Math.floor((24 * 60) / step) }, (_, i) => {
          const minutes = i * step
          return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
     })
     return all.filter((t) => (!range.min || t >= range.min) && (!range.max || t <= range.max))
}

/** Closing at or before opening = after midnight (a bar open 18:00 → 02:00). */
export function isOvernight(opens: string, closes: string): boolean {
     return closes <= opens
}
