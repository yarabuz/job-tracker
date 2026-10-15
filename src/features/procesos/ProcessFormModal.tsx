import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Trash2 } from 'lucide-react'
import type { Process, Stage } from '../../store/types'
import { STAGES } from './stages'

export interface ProcessFormValues {
  company: string
  role: string
  stage: Stage
  jobUrl?: string
  salaryNote?: string
  notes?: string
}

export default function ProcessFormModal({
  initial,
  onSubmit,
  onClose,
  onDelete,
}: {
  initial?: Process
  onSubmit: (values: ProcessFormValues) => void
  onClose: () => void
  onDelete?: () => void
}) {
  const { t } = useTranslation()
  const [company, setCompany] = useState(initial?.company ?? '')
  const [role, setRole] = useState(initial?.role ?? '')
  const [stage, setStage] = useState<Stage>(initial?.stage ?? 'saved')
  const [jobUrl, setJobUrl] = useState(initial?.jobUrl ?? '')
  const [salaryNote, setSalaryNote] = useState(initial?.salaryNote ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const valid = company.trim() !== '' && role.trim() !== ''

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    onSubmit({
      company: company.trim(),
      role: role.trim(),
      stage,
      jobUrl: jobUrl.trim() || undefined,
      salaryNote: salaryNote.trim() || undefined,
      notes: notes.trim() || undefined,
    })
  }

  const inputCls =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400'
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/60"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {initial
              ? t('procesos.form.editTitle')
              : t('procesos.form.newTitle')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="f-company">
                {t('procesos.form.company')}
              </label>
              <input
                id="f-company"
                className={inputCls}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="f-role">
                {t('procesos.form.role')}
              </label>
              <input
                id="f-role"
                className={inputCls}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="f-stage">
                {t('procesos.form.stage')}
              </label>
              <select
                id="f-stage"
                className={inputCls}
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage)}
              >
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {t(s.labelKey)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="f-url">
                {t('procesos.form.jobUrl')}
              </label>
              <input
                id="f-url"
                type="url"
                placeholder="https://…"
                className={inputCls}
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="f-salary">
              {t('procesos.form.salaryNote')}
            </label>
            <input
              id="f-salary"
              placeholder="Ej: USD 3.000–4.000"
              className={inputCls}
              value={salaryNote}
              onChange={(e) => setSalaryNote(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="f-notes">
              {t('procesos.form.notes')}
            </label>
            <textarea
              id="f-notes"
              rows={3}
              className={inputCls}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
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
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
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
