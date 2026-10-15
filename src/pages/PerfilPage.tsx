import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import type { Skill } from '../store/types'
import SkillFormModal, {
  type SkillFormValues,
} from '../features/perfil/SkillFormModal'
import { SkillSection } from '../features/perfil/SkillCard'

type ModalState =
  | { mode: 'new'; obtained: boolean }
  | { mode: 'edit'; skill: Skill }
  | null

export default function PerfilPage() {
  const { t } = useTranslation()
  const skills = useStore((s) => s.skills)
  const addSkill = useStore((s) => s.addSkill)
  const updateSkill = useStore((s) => s.updateSkill)
  const deleteSkill = useStore((s) => s.deleteSkill)
  const [modal, setModal] = useState<ModalState>(null)

  const obtainedSkills = skills.filter((s) => s.obtained)
  const pendingSkills = skills.filter((s) => !s.obtained)

  const handleSubmit = (values: SkillFormValues) => {
    if (modal?.mode === 'edit') {
      updateSkill(modal.skill.id, values)
    } else {
      addSkill(values)
    }
    setModal(null)
  }

  const handleToggle = (skill: Skill) => {
    updateSkill(skill.id, { obtained: !skill.obtained })
  }

  const handleDelete = () => {
    if (modal?.mode !== 'edit') return
    if (!window.confirm(t('skills.confirmDelete'))) return
    deleteSkill(modal.skill.id)
    setModal(null)
  }

  const renderColumn = (obtained: boolean) => {
    const list = obtained ? obtainedSkills : pendingSkills
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {obtained ? t('skills.obtainedTitle') : t('skills.pendingTitle')}
            <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
              {list.length}
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setModal({ mode: 'new', obtained })}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('skills.new')}
          </button>
        </div>
        <SkillSection
          title={t('skills.hard')}
          skills={list.filter((s) => s.kind === 'hard')}
          emptyText={t('skills.empty')}
          onEdit={(s) => setModal({ mode: 'edit', skill: s })}
          onToggle={handleToggle}
        />
        <SkillSection
          title={t('skills.soft')}
          skills={list.filter((s) => s.kind === 'soft')}
          emptyText={t('skills.empty')}
          onEdit={(s) => setModal({ mode: 'edit', skill: s })}
          onToggle={handleToggle}
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={t('pages.perfil.title')}
        subtitle={t('pages.perfil.subtitle')}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {renderColumn(true)}
        {renderColumn(false)}
      </div>

      {modal && (
        <SkillFormModal
          initial={modal.mode === 'edit' ? modal.skill : undefined}
          defaultObtained={modal.mode === 'new' ? modal.obtained : undefined}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
          onDelete={modal.mode === 'edit' ? handleDelete : undefined}
        />
      )}
    </div>
  )
}
