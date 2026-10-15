import type { AppEvent, EventType, Process } from '../store/types'
import { isWithin } from './dates'

const TYPE_LABELS: Record<EventType, string> = {
  contact: 'Contacto',
  interview: 'Entrevista',
  followup: 'Seguimiento',
  application: 'Postulación',
  task: 'Tarea',
}

const TYPE_ORDER: EventType[] = [
  'contact',
  'interview',
  'followup',
  'application',
  'task',
]

export interface WeekReport {
  start: Date
  end: Date
  total: number
  byType: Record<EventType, number>
  byProcess: { process: Process | null; count: number }[]
  applications: number
  interviews: number
}

export function buildWeekReport(
  events: AppEvent[],
  processes: Process[],
  start: Date,
  end: Date,
): WeekReport {
  const weekEvents = events.filter((e) => isWithin(e.date, start, end))

  const byType = Object.fromEntries(
    TYPE_ORDER.map((t) => [t, 0]),
  ) as Record<EventType, number>
  weekEvents.forEach((e) => {
    byType[e.type] = (byType[e.type] ?? 0) + 1
  })

  const countsByProcess = new Map<string, number>()
  let withoutProcess = 0
  weekEvents.forEach((e) => {
    if (e.processId) {
      countsByProcess.set(e.processId, (countsByProcess.get(e.processId) ?? 0) + 1)
    } else {
      withoutProcess++
    }
  })

  const byProcess = [...countsByProcess.entries()]
    .map(([pid, count]) => ({
      process: processes.find((p) => p.id === pid) ?? null,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  if (withoutProcess > 0) {
    byProcess.push({ process: null, count: withoutProcess })
  }

  return {
    start,
    end,
    total: weekEvents.length,
    byType,
    byProcess,
    applications: byType.application,
    interviews: byType.interview,
  }
}

export function reportToMarkdown(report: WeekReport): string {
  const fmtDay = new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const lines: string[] = []

  lines.push(`# Reporte semanal — ${fmtDay.format(report.start)}`)
  lines.push('')
  lines.push(`**Total de actividades:** ${report.total}`)
  lines.push('')
  lines.push('## Por tipo')
  lines.push('')
  lines.push('| Tipo | Cantidad |')
  lines.push('| --- | --- |')
  for (const t of TYPE_ORDER) {
    lines.push(`| ${TYPE_LABELS[t]} | ${report.byType[t]} |`)
  }
  lines.push('')
  lines.push('## Por proceso')
  lines.push('')
  if (report.byProcess.length === 0) {
    lines.push('_Sin actividades esta semana._')
  } else {
    lines.push('| Proceso | Actividades |')
    lines.push('| --- | --- |')
    for (const row of report.byProcess) {
      const name = row.process
        ? `${row.process.company} — ${row.process.role}`
        : 'Sin proceso'
      lines.push(`| ${name} | ${row.count} |`)
    }
  }
  lines.push('')
  lines.push('## Conversión')
  lines.push('')
  lines.push(
    `Postulaciones: **${report.applications}** · Entrevistas: **${report.interviews}**`,
  )
  lines.push('')
  return lines.join('\n')
}
