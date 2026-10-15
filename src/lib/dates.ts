export function startOfWeek(d: Date): Date {
  const r = new Date(d)
  r.setHours(0, 0, 0, 0)
  const day = r.getDay()
  const diff = day === 0 ? 6 : day - 1
  r.setDate(r.getDate() - diff)
  return r
}

export function endOfWeek(d: Date): Date {
  const r = startOfWeek(d)
  r.setDate(r.getDate() + 7)
  return r
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatShortRange(start: Date, end: Date): string {
  const fmt = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' })
  return `${fmt.format(start)} – ${fmt.format(new Date(end.getTime() - 1))}`
}

export function formatDayShort(d: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d)
}

export function isWithin(eventDate: string, start: Date, end: Date): boolean {
  const d = new Date(eventDate)
  return d >= start && d < end
}
