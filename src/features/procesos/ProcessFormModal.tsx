import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight, Plus, X, Trash2 } from 'lucide-react'
import type { Contact, InterviewGuide, Process, Stage } from '../../store/types'
import { STAGES } from './stages'

export interface ProcessFormValues {
  company: string
  role: string
  stage: Stage
  jobUrl?: string
  salaryNote?: string
  firstContactDate?: string
  contacts?: Contact[]
  interview?: InterviewGuide
  notes?: string
}

const DEFAULT_POINT_KEYS = [
  'flow',
  'type',
  'salary',
  'feedback',
  'myQuestions',
] as const

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
  const [firstContactDate, setFirstContactDate] = useState(
    initial?.firstContactDate ?? '',
  )
  const [contacts, setContacts] = useState<Contact[]>(initial?.contacts ?? [])
  const [interview, setInterview] = useState<InterviewGuide | undefined>(
    initial?.interview ??
      (initial?.stage === 'interviewing'
        ? {
            items: DEFAULT_POINT_KEYS.map((key) => ({
              id: crypto.randomUUID(),
              label: t(`procesos.form.interviewPoints.${key}`),
              done: false,
            })),
          }
        : undefined),
  )
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [notes, setNotes] = useState(initial?.notes ?? '')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const changeStage = (next: Stage) => {
    setStage(next)
    if (next === 'interviewing' && !interview) {
      setInterview({
        items: DEFAULT_POINT_KEYS.map((key) => ({
          id: crypto.randomUUID(),
          label: t(`procesos.form.interviewPoints.${key}`),
          done: false,
        })),
      })
    }
    if (next !== 'interviewing') setExpandedItem(null)
  }

  const valid = company.trim() !== '' && role.trim() !== ''

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    const cleanContacts = contacts
      .filter((c) => c.name.trim() !== '')
      .map((c) => ({
        ...c,
        name: c.name.trim(),
        role: c.role?.trim() || undefined,
      }))
    onSubmit({
      company: company.trim(),
      role: role.trim(),
      stage,
      jobUrl: jobUrl.trim() || undefined,
      salaryNote: salaryNote.trim() || undefined,
      firstContactDate: firstContactDate || undefined,
      contacts: cleanContacts.length > 0 ? cleanContacts : undefined,
      interview:
        interview && interview.items.length > 0 ? interview : undefined,
      notes: notes.trim() || undefined,
    })
  }

  const addContact = () =>
    setContacts((cs) => [
      ...cs,
      { id: crypto.randomUUID(), name: '', role: '' },
    ])

  const setContactField = (id: string, field: 'name' | 'role', value: string) =>
    setContacts((cs) =>
      cs.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    )

  const removeContact = (id: string) =>
    setContacts((cs) => cs.filter((c) => c.id !== id))

  const updateInterview = (patch: Partial<InterviewGuide>) =>
    setInterview((iv) => (iv ? { ...iv, ...patch } : iv))

  const updateItem = (id: string, patch: Partial<InterviewGuide['items'][number]>) =>
    setInterview((iv) =>
      iv
        ? {
            ...iv,
            items: iv.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
          }
        : iv,
    )

  const removeItem = (id: string) =>
    setInterview((iv) =>
      iv ? { ...iv, items: iv.items.filter((it) => it.id !== id) } : iv,
    )

  const addItem = () => {
    const id = crypto.randomUUID()
    setInterview((iv) =>
      iv
        ? { ...iv, items: [...iv.items, { id, label: '', done: false }] }
        : iv,
    )
    setExpandedItem(id)
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
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
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
                onChange={(e) => changeStage(e.target.value as Stage)}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <label className={labelCls} htmlFor="f-first-contact">
                {t('procesos.form.firstContactDate')}
              </label>
              <input
                id="f-first-contact"
                type="date"
                className={inputCls}
                value={firstContactDate}
                onChange={(e) => setFirstContactDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <span className={labelCls}>{t('procesos.form.contacts')}</span>
            <div className="flex flex-col gap-2">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <input
                    className={inputCls}
                    placeholder={t('procesos.form.contactName')}
                    value={c.name}
                    onChange={(e) => setContactField(c.id, 'name', e.target.value)}
                  />
                  <input
                    className={inputCls}
                    placeholder={t('procesos.form.contactRole')}
                    value={c.role ?? ''}
                    onChange={(e) => setContactField(c.id, 'role', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeContact(c.id)}
                    className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-700 dark:hover:text-red-400"
                    aria-label={t('common.delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addContact}
                className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
                {t('procesos.form.addContact')}
              </button>
            </div>
          </div>

          {stage === 'interviewing' && interview && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
              <span className="mb-2 block text-sm font-semibold text-amber-800 dark:text-amber-300">
                {t('procesos.form.interviewGuide')}
              </span>
              <div className="mb-3">
                <input
                  className={inputCls}
                  placeholder={t('procesos.form.interviewTypePlaceholder')}
                  value={interview.type ?? ''}
                  onChange={(e) => updateInterview({ type: e.target.value })}
                  aria-label={t('procesos.form.interviewType')}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                {interview.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedItem((cur) => (cur === item.id ? null : item.id))
                        }
                        className="rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        aria-label={t('procesos.form.editPoint')}
                      >
                        {expandedItem === item.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={(e) =>
                          updateItem(item.id, { done: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <input
                        className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-sm text-slate-800 hover:border-slate-200 focus:border-sky-500 focus:outline-none dark:text-slate-200 dark:hover:border-slate-600"
                        value={item.label}
                        placeholder={t('procesos.form.editPoint')}
                        onChange={(e) =>
                          updateItem(item.id, { label: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 rounded p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        aria-label={t('common.delete')}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {expandedItem === item.id && (
                      <textarea
                        rows={3}
                        className="w-full border-t border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none dark:border-slate-700 dark:text-slate-200"
                        placeholder={t('procesos.form.notes')}
                        value={item.notes ?? ''}
                        onChange={(e) =>
                          updateItem(item.id, { notes: e.target.value })
                        }
                      />
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Plus className="h-4 w-4" />
                  {t('procesos.form.addPoint')}
                </button>
              </div>
            </div>
          )}

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
