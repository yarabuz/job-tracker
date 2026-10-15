import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2, X } from 'lucide-react'
import type { AppEvent, EventType, Process } from '../../store/types'
import { EVENT_TYPES } from './eventMeta'

export interface EventFormValues {
  title: string
  type: EventType
  date: string
  processId?: string
  notes?: string
  done: boolean
}

function splitDate(iso: string): { date: string; time: string } {
  const idx = iso.indexOf('T')
  if (idx === -1) {
    return { date: iso.slice(0, 10), time: '' }
  }
  return { date: iso.slice(0, 10), time: iso.slice(idx + 1, idx + 6) }
}

export default function EventFormModal({
  initial,
  defaultDate,
  processes,
  onSubmit,
  onClose,
  onDelete,
}: {
  initial?: AppEvent
  defaultDate?: string
  processes: Process[]
  onSubmit: (values: EventFormValues) => void
  onClose: () => void
  onDelete?: () => void
}) {
  const { t } = useTranslation()
  const [parts] = useState(() =>
    splitDate(initial?.date ?? defaultDate ?? new Date().toISOString()),
  )
  const [title, setTitle] = useState(initial?.title ?? '')
  const [type, setType] = useState<EventType>(initial?.type ?? 'task')
  const [date, setDate] = useState(parts.date)
  const [time, setTime] = useState(parts.time)
  const [processId, setProcessId] = useState(initial?.processId ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [done, setDone] = useState(initial?.done ?? false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const valid = title.trim() !== '' && date !== ''

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    const fullDate = time ? `${date}T${time}` : date
    onSubmit({
      title: title.trim(),
      type,
      date: fullDate,
      processId: processId || undefined,
      notes: notes.trim() || undefined,
      done,
    })
  }

  const inputCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {initial
              ? t('calendario.form.editTitle')
              : t('calendario.form.newTitle')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className={labelCls} htmlFor="e-title">
              {t('calendario.form.title')}
            </label>
            <input
              id="e-title"
              className={inputCls}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="e-type">
                {t('calendario.form.type')}
              </label>
              <select
                id="e-type"
                className={inputCls}
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
              >
                {EVENT_TYPES.map((et) => (
                  <option key={et.key} value={et.key}>
                    {t(et.labelKey)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="e-date">
                {t('calendario.form.date')}
              </label>
              <input
                id="e-date"
                type="date"
                className={inputCls}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="e-time">
                {t('calendario.form.time')}
              </label>
              <input
                id="e-time"
                type="time"
                className={inputCls}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="e-process">
              {t('calendario.form.process')}
            </label>
            <select
              id="e-process"
              className={inputCls}
              value={processId}
              onChange={(e) => setProcessId(e.target.value)}
            >
              <option value="">{t('calendario.form.noProcess')}</option>
              {processes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.company} — {p.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="e-notes">
              {t('calendario.form.notes')}
            </label>
            <textarea
              id="e-notes"
              rows={3}
              className={inputCls}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={done}
              onChange={(e) => setDone(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            {t('calendario.form.done')}
          </label>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('common.delete')}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={!valid}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
