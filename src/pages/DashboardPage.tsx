import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Plus,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import { EVENT_TYPES } from '../features/calendario/eventMeta'
import EventFormModal, {
  type EventFormValues,
} from '../features/calendario/EventFormModal'
import { STAGES } from '../features/procesos/stages'
import {
  addDays,
  endOfWeek,
  formatDayShort,
  formatShortRange,
  isWithin,
  startOfWeek,
} from '../lib/dates'
import { buildWeekReport, reportToMarkdown } from '../lib/report'
import { downloadText } from '../lib/backup'

function downloadReportMarkdownFor(weekStart: Date, weekEnd: Date): void {
  const state = useStore.getState()
  const report = buildWeekReport(state.events, state.processes, weekStart, weekEnd)
  const d = new Date()
  const stamp = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
  downloadText(reportToMarkdown(report), `reporte-semanal-${stamp}.md`, 'text/markdown')
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const events = useStore((s) => s.events)
  const processes = useStore((s) => s.processes)
  const addEvent = useStore((s) => s.addEvent)
  const [quickAdd, setQuickAdd] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)
  const [today] = useState(() => new Date())

  const weekStart = useMemo(
    () => addDays(startOfWeek(today), weekOffset * 7),
    [today, weekOffset],
  )
  const weekEnd = useMemo(() => endOfWeek(weekStart), [weekStart])

  const report = useMemo(
    () => buildWeekReport(events, processes, weekStart, weekEnd),
    [events, processes, weekStart, weekEnd],
  )

  const upcoming = useMemo(() => {
    const limit = addDays(today, 7)
    return events
      .filter((e) => !e.done && isWithin(e.date, today, limit))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 6)
  }, [events, today])

  const handleQuickAdd = (values: EventFormValues) => {
    addEvent({ ...values })
    setQuickAdd(false)
  }

  const stageCounts = STAGES.map((stage) => ({
    ...stage,
    count: processes.filter((p) => p.stage === stage.key).length,
  }))
  const activeCount =
    processes.filter((p) => p.stage === 'saved' || p.stage === 'applied' || p.stage === 'interviewing')
      .length

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={t('pages.dashboard.title')}
          subtitle={t('pages.dashboard.subtitle')}
        />
        <button
          type="button"
          onClick={() => setQuickAdd(true)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          {t('dashboard.quickAdd')}
        </button>
      </div>

      {/* Actividad de la semana */}
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">
            {t('dashboard.weekActivity')}
          </h2>
          <span className="text-xs text-slate-500">
            {formatShortRange(weekStart, weekEnd)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {EVENT_TYPES.map((et) => (
            <div key={et.key} className="rounded-lg p-3" style={{ backgroundColor: `${et.color}14` }}>
              <p className="text-2xl font-bold" style={{ color: et.color }}>
                {report.byType[et.key]}
              </p>
              <p className="text-xs font-medium text-slate-600">
                {t(et.labelKey)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600">
          {t('dashboard.totalWeek')}: <strong>{report.total}</strong> ·{' '}
          {t('dashboard.activeProcesses')}: <strong>{activeCount}</strong>
        </p>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Próximos eventos */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
            <CalendarClock className="h-4 w-4 text-sky-600" />
            {t('dashboard.upcoming')}
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-400">{t('dashboard.noUpcoming')}</p>
          ) : (
            <ul className="flex flex-col divide-y divide-slate-100">
              {upcoming.map((e) => {
                const meta = EVENT_TYPES.find((et) => et.key === e.type)
                const proc = processes.find((p) => p.id === e.processId)
                return (
                  <li key={e.id} className="flex items-center gap-3 py-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: meta?.color }}
                    />
                    <span className="shrink-0 text-xs font-medium text-slate-500">
                      {formatDayShort(new Date(e.date))}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-800">
                      {e.title}
                    </span>
                    {proc && (
                      <span className="shrink-0 truncate text-xs text-slate-400">
                        {proc.company}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Procesos por etapa */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            {t('dashboard.processesByStage')}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {stageCounts.map((stage) => (
              <div
                key={stage.key}
                className={`rounded-lg px-3 py-2 text-center ${stage.headerBg}`}
              >
                <p className="text-xl font-bold">{stage.count}</p>
                <p className="text-[11px] font-medium">{t(stage.labelKey)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Reporte semanal */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">
            {t('dashboard.weeklyReport')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w - 1)}
              className="rounded-lg border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-36 text-center text-sm font-medium text-slate-700">
              {formatShortRange(weekStart, weekEnd)}
            </span>
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w + 1)}
              className="rounded-lg border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"
              aria-label="Semana siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            {weekOffset !== 0 && (
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
              >
                {t('dashboard.thisWeek')}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-700">
              {t('dashboard.byProcess')}
            </h3>
            {report.byProcess.length === 0 ? (
              <p className="text-sm text-slate-400">{t('dashboard.noWeekActivity')}</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                    <th className="py-1.5 font-medium">{t('dashboard.processCol')}</th>
                    <th className="py-1.5 text-right font-medium">
                      {t('dashboard.countCol')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.byProcess.map((row, i) => (
                    <tr key={row.process?.id ?? `none-${i}`} className="border-b border-slate-100">
                      <td className="py-1.5 text-slate-800">
                        {row.process
                          ? `${row.process.company} — ${row.process.role}`
                          : t('dashboard.withoutProcess')}
                      </td>
                      <td className="py-1.5 text-right font-semibold text-slate-900">
                        {row.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-700">
              {t('dashboard.conversion')}
            </h3>
            <div className="flex gap-3">
              <div className="flex-1 rounded-lg bg-indigo-50 p-3 text-center">
                <p className="text-2xl font-bold text-indigo-700">
                  {report.applications}
                </p>
                <p className="text-xs text-indigo-600">{t('eventTypes.application')}</p>
              </div>
              <div className="flex-1 rounded-lg bg-amber-50 p-3 text-center">
                <p className="text-2xl font-bold text-amber-700">
                  {report.interviews}
                </p>
                <p className="text-xs text-amber-600">{t('eventTypes.interview')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => downloadReportMarkdownFor(weekStart, weekEnd)}
              disabled={report.total === 0}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {weekOffset === 0 ? (
                <Download className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {t('dashboard.exportMarkdown')}
            </button>
          </div>
        </div>
      </section>

      {quickAdd && (
        <EventFormModal
          processes={processes}
          onSubmit={handleQuickAdd}
          onClose={() => setQuickAdd(false)}
        />
      )}
    </div>
  )
}
