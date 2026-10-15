import type { AppEvent, EventType, Process } from '../store/types'
import { intlLocale, isWithin } from './dates'
import i18n from '../i18n'

const TYPE_LABELS: Record<string, Record<EventType, string>> = {
  es: {
    contact: 'Contacto',
    interview: 'Entrevista',
    followup: 'Seguimiento',
    application: 'Postulación',
    task: 'Tarea',
  },
  en: {
    contact: 'Contact',
    interview: 'Interview',
    followup: 'Follow-up',
    application: 'Application',
    task: 'Task',
  },
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
  const lang = i18n.language === 'en' ? 'en' : 'es'
  const labels = TYPE_LABELS[lang]
  const fmtDay = new Intl.DateTimeFormat(intlLocale(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const lines: string[] = []

  lines.push(
    lang === 'en'
      ? `# Weekly report — ${fmtDay.format(report.start)}`
      : `# Reporte semanal — ${fmtDay.format(report.start)}`,
  )
  lines.push('')
  lines.push(
    lang === 'en'
      ? `**Total activities:** ${report.total}`
      : `**Total de actividades:** ${report.total}`,
  )
  lines.push('')
  lines.push(lang === 'en' ? '## By type' : '## Por tipo')
  lines.push('')
  lines.push(lang === 'en' ? '| Type | Count |' : '| Tipo | Cantidad |')
  lines.push('| --- | --- |')
  for (const t of TYPE_ORDER) {
    lines.push(`| ${labels[t]} | ${report.byType[t]} |`)
  }
  lines.push('')
  lines.push(lang === 'en' ? '## By process' : '## Por proceso')
  lines.push('')
  if (report.byProcess.length === 0) {
    lines.push(
      lang === 'en' ? '_No activities this week._' : '_Sin actividades esta semana._',
    )
  } else {
    lines.push(
      lang === 'en' ? '| Process | Activities |' : '| Proceso | Actividades |',
    )
    lines.push('| --- | --- |')
    for (const row of report.byProcess) {
      const name = row.process
        ? `${row.process.company} — ${row.process.role}`
        : lang === 'en'
          ? 'No process'
          : 'Sin proceso'
      lines.push(`| ${name} | ${row.count} |`)
    }
  }
  lines.push('')
  lines.push(lang === 'en' ? '## Conversion' : '## Conversión')
  lines.push('')
  if (lang === 'en') {
    lines.push(
      `Applications: **${report.applications}** · Interviews: **${report.interviews}**`,
    )
  } else {
    lines.push(
      `Postulaciones: **${report.applications}** · Entrevistas: **${report.interviews}**`,
    )
  }
  lines.push('')
  return lines.join('\n')
}
