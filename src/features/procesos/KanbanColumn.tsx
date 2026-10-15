import { useDroppable } from '@dnd-kit/core'
import { useTranslation } from 'react-i18next'
import type { Process, Stage } from '../../store/types'
import { STAGES } from './stages'
import ProcessCard from './ProcessCard'

export default function KanbanColumn({
  stage,
  processes,
  onEdit,
}: {
  stage: Stage
  processes: Process[]
  onEdit: (p: Process) => void
}) {
  const { t } = useTranslation()
  const meta = STAGES.find((s) => s.key === stage)!
  const { setNodeRef, isOver } = useDroppable({ id: stage })

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div
        className={`mb-2 rounded-lg px-3 py-2 text-sm font-semibold ${meta.headerBg}`}
      >
        {t(meta.labelKey)}
        <span className="ml-2 rounded-full bg-white/70 px-2 py-0.5 text-xs">
          {processes.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-2 rounded-lg border-2 border-dashed p-2 transition-colors ${
          isOver
            ? 'border-sky-400 bg-sky-50 dark:border-sky-600 dark:bg-sky-950/40'
            : `border-transparent bg-slate-50/70 dark:bg-slate-900/50 ${meta.accent}`
        }`}
      >
        {processes.map((p) => (
          <ProcessCard key={p.id} process={p} onEdit={onEdit} dragDisabled={false} />
        ))}
      </div>
    </div>
  )
}
