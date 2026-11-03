import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import type { Quote } from '../../store/types'

export default function SortableQuoteCard({
  quote,
  disabled,
  onEdit,
  onDelete,
}: {
  quote: Quote
  disabled: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: quote.id, disabled })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${
        isDragging ? 'z-10 opacity-80 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            {...listeners}
            {...attributes}
            disabled={disabled}
            className={`rounded p-1 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 ${
              disabled ? 'cursor-not-allowed opacity-40' : 'cursor-grab'
            }`}
            aria-label={t('links.drag')}
            title={t('quotes.drag')}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label={t('procesos.edit')}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
            aria-label={t('common.delete')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {quote.quote && (
        <p className="mt-2">
          {quote.quote}
        </p>
      )}

      {quote.author && (
        <span className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            {quote.author}
        </span>
      )}

    </div>
  )
}
