import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2, X } from 'lucide-react'
import type { Skill, SkillKind } from '../../store/types'

export interface SkillFormValues {
  name: string
  kind: SkillKind
  obtained: boolean
  level?: number
  targetNotes?: string
}

export default function SkillFormModal({
  initial,
  defaultObtained,
  onSubmit,
  onClose,
  onDelete,
}: {
  initial?: Skill
  defaultObtained?: boolean
  onSubmit: (values: SkillFormValues) => void
  onClose: () => void
  onDelete?: () => void
}) {
  const { t } = useTranslation()
  const [name, setName] = useState(initial?.name ?? '')
  const [kind, setKind] = useState<SkillKind>(initial?.kind ?? 'hard')
  const [obtained, setObtained] = useState(initial?.obtained ?? defaultObtained ?? false)
  const [level, setLevel] = useState(initial?.level ?? 3)
  const [targetNotes, setTargetNotes] = useState(initial?.targetNotes ?? '')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const valid = name.trim() !== ''

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    onSubmit({
      name: name.trim(),
      kind,
      obtained,
      level,
      targetNotes: targetNotes.trim() || undefined,
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
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {initial ? t('skills.form.editTitle') : t('skills.form.newTitle')}
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
          <div>
            <label className={labelCls} htmlFor="s-name">
              {t('skills.form.name')}
            </label>
            <input
              id="s-name"
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="s-kind">
                {t('skills.form.kind')}
              </label>
              <select
                id="s-kind"
                className={inputCls}
                value={kind}
                onChange={(e) => setKind(e.target.value as SkillKind)}
              >
                <option value="hard">{t('skills.hard')}</option>
                <option value="soft">{t('skills.soft')}</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="s-level">
                {t('skills.form.level')}
              </label>
              <select
                id="s-level"
                className={inputCls}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} ★
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="s-notes">
              {t('skills.form.targetNotes')}
            </label>
            <textarea
              id="s-notes"
              rows={2}
              placeholder={t('skills.form.targetNotesPlaceholder')}
              className={inputCls}
              value={targetNotes}
              onChange={(e) => setTargetNotes(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={obtained}
              onChange={(e) => setObtained(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600"
            />
            {t('skills.form.obtained')}
          </label>

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
