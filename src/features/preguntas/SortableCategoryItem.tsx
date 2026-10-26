import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { GripVertical, Pencil } from 'lucide-react'
import type { QuestionCategory } from '../../store/types'

export default function SortableCategoryItem({
  category,
  count,
  active,
  onSelect,
  onEdit,
}: {
  category: QuestionCategory
  count: number
  active: boolean
  onSelect: () => void
  onEdit: () => void
}) {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: category.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'z-10 opacity-80' : ''}
    >
      <div
        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
          active
            ? 'bg-sky-600 text-white'
            : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
      >
        <button
          type="button"
          className="flex-1 truncate text-left"
          onClick={onSelect}
        >
          {category.name}
          <span
            className={`ml-2 text-xs ${active ? 'text-sky-100' : 'text-slate-400'}`}
          >
            {count}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            {...listeners}
            {...attributes}
            className={`rounded p-1 ${
              active
                ? 'cursor-grab text-sky-100 hover:bg-sky-700'
                : 'cursor-grab text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400'
            }`}
            aria-label={t('preguntas.drag')}
            title={t('preguntas.drag')}
          >
            <GripVertical className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onEdit}
            className={`rounded p-1 ${
              active
                ? 'text-sky-100 hover:bg-sky-700'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300'
            }`}
            aria-label={t('procesos.edit')}
          >
            <Pencil className="h-3 w-3" />
          </button>
        </div>
      </div>
    </li>
  )
}
