import { emptyData, type DataState } from '../store/types'

export function exportFilename(): string {
  const d = new Date()
  const date = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
  return `job-tracker-${date}.json`
}

export function downloadText(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadJson(data: DataState): void {
  downloadText(
    JSON.stringify(data, null, 2),
    exportFilename(),
    'application/json',
  )
}

export function parseImportedData(
  text: string,
): { ok: true; data: DataState } | { ok: false; error: string } {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, error: 'invalid-json' }
  }

  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, error: 'invalid-schema' }
  }

  const obj = raw as Record<string, unknown>
  if (typeof obj.schemaVersion !== 'number') {
    return { ok: false, error: 'invalid-schema' }
  }
  if (obj.schemaVersion > 1) {
    return { ok: false, error: 'newer-version' }
  }

  const base = emptyData()
  const strArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []

  const data: DataState = {
    ...base,
    processes: Array.isArray(obj.processes) ? (obj.processes as DataState['processes']) : [],
    events: Array.isArray(obj.events) ? (obj.events as DataState['events']) : [],
    skills: Array.isArray(obj.skills) ? (obj.skills as DataState['skills']) : [],
    links: Array.isArray(obj.links)
      ? (obj.links as DataState['links']).map((l) => ({
          ...l,
          tags: strArray((l as { tags?: unknown }).tags),
        }))
      : [],
    lastExportAt:
      typeof obj.lastExportAt === 'string' ? obj.lastExportAt : null,
    theme:
      obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'system'
        ? obj.theme
        : 'system',
    lang: obj.lang === 'en' ? 'en' : 'es',
  }

  return { ok: true, data }
}
