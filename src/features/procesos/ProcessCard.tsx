import { useDraggable } from '@dnd-kit/core'
import { useTranslation } from 'react-i18next'
import { ExternalLink, StickyNote } from 'lucide-react'
import type { Process } from '../../store/types'

export default function ProcessCard({
  process,
  onEdit,
  dragDisabled,
}: {
  process: Process
  onEdit: (p: Process) => void
  dragDisabled: boolean
}) {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: process.id,
    disabled: dragDisabled,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-sky-300 hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-700 ${
        isDragging ? 'opacity-50' : ''
      }`}
      onDoubleClick={() => onEdit(process)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {process.company}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {process.role}
          </p>
        </div>
        <button
          type="button"
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(process)
          }}
          aria-label={t('procesos.edit')}
        >
          <StickyNote className="h-3.5 w-3.5" />
        </button>
      </div>

      {(process.salaryNote || process.jobUrl) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {process.salaryNote && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {process.salaryNote}
            </span>
          )}
          {process.jobUrl && (
            <a
              href={process.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sky-700 hover:underline dark:text-sky-400"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
              {t('procesos.openJob')}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
