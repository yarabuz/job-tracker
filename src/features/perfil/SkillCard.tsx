import { useTranslation } from 'react-i18next'
import { Check, Pencil, Star } from 'lucide-react'
import type { Skill } from '../../store/types'

export function SkillCard({
  skill,
  onEdit,
  onToggle,
}: {
  skill: Skill
  onEdit: (s: Skill) => void
  onToggle: (s: Skill) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              skill.kind === 'hard'
                ? 'bg-indigo-50 text-indigo-700'
                : 'bg-pink-50 text-pink-700'
            }`}
          >
            {skill.kind === 'hard' ? t('skills.hard') : t('skills.soft')}
          </span>
        </div>
        <p className="mt-1 text-sm font-medium text-slate-900">{skill.name}</p>
        <div className="mt-1 flex items-center gap-0.5 text-amber-500">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`h-3.5 w-3.5 ${
                n <= (skill.level ?? 0) ? 'fill-current' : 'text-slate-300'
              }`}
            />
          ))}
        </div>
        {skill.targetNotes && (
          <p className="mt-1 text-xs text-slate-500">{skill.targetNotes}</p>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => onToggle(skill)}
          title={
            skill.obtained ? t('skills.markPending') : t('skills.markObtained')
          }
          className={`rounded-lg p-1.5 hover:bg-slate-100 ${
            skill.obtained
              ? 'text-emerald-600'
              : 'text-slate-400 hover:text-emerald-600'
          }`}
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onEdit(skill)}
          title={t('procesos.edit')}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function SkillSection({
  title,
  skills,
  emptyText,
  onEdit,
  onToggle,
}: {
  title: string
  skills: Skill[]
  emptyText: string
  onEdit: (s: Skill) => void
  onToggle: (s: Skill) => void
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-700">{title}</h3>
      {skills.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-3 text-xs text-slate-400">
          {emptyText}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {skills.map((s) => (
            <SkillCard key={s.id} skill={s} onEdit={onEdit} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  )
}
