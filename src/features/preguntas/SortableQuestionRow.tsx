import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { ChevronDown, GripVertical, Pencil } from 'lucide-react'
import type { Question } from '../../store/types'

export default function SortableQuestionRow({
  question,
  onEdit,
  onDelete,
}: {
  question: Question
  onEdit: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: question.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 ${
        isDragging ? 'z-10 opacity-80 shadow-lg' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
        <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
          {question.question}
        </span>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-700">
          <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
            {question.answer}
          </p>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-slate-100 px-2 py-1.5 dark:border-slate-700">
        <button
          type="button"
          {...listeners}
          {...attributes}
          className="cursor-grab rounded p-1.5 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
          aria-label={t('preguntas.drag')}
          title={t('preguntas.drag')}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label={t('procesos.edit')}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
            aria-label={t('common.delete')}
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
