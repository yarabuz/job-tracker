import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus, Search } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import type { Quote } from '../store/types'
import QuoteFormModal, { type QuoteFormValues } from '../features/citas/QuoteFormModal'
import SortableQuoteCard from '../features/citas/SortableQuoteCard'

type ModalState =
  | { mode: 'new' }
  | { mode: 'edit'; quote: Quote }
  | null

export default function CitassPage() {
  const { t } = useTranslation()
  const quotes = useStore((s) => s.quotes)
  const addQuote = useStore((s) => s.addQuote)
  const updateQuote = useStore((s) => s.updateQuote)
  const deleteQuote = useStore((s) => s.deleteQuote)
  const reorderQuotes = useStore((s) => s.reorderQuotes)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<ModalState>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const isFiltered = search.trim() !== ''

  const filtered = useMemo(() => {
      const q = search.trim().toLowerCase()
      return quotes.filter((quote) => {
        if (!q) return true
        return (
          quote.quote.toLowerCase().includes(q) ||
          quote.author?.toLowerCase().includes(q) 
        )
      })
    }, [quotes, search])

  const handleSubmit = (values: QuoteFormValues) => {
    if (modal?.mode === 'edit') {
      updateQuote(modal.quote.id, values)
    } else {
        console.log(`handleSubmit: ${values}`)
      addQuote(values)
    }
    setModal(null)
  }

  const handleDelete = (quote: Quote) => {
    if (window.confirm(t('quotes.confirmDelete'))) {
      deleteQuote(quote.id)
    }
  }

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      reorderQuotes(String(active.id), String(over.id))
    }

  return (
    <div>
      <PageHeader
        title={t('quotes.title')}
        subtitle={t('quotes.subtitle')}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setModal({ mode: 'new' })}
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          {t('quotes.new')}
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder={t('links.searchPlaceholder')}
            className="w-64 rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


    {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
        {isFiltered ? t('links.noResults') : t('links.empty')}
        </div>
    ) : (
        <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        >
        <SortableContext
            items={filtered.map((l) => l.id)}
            strategy={rectSortingStrategy}
        >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((quote) => (
                <SortableQuoteCard
                key={quote.id}
                quote={quote}
                disabled={isFiltered}
                onEdit={() => setModal({ mode: 'edit', quote })}
                onDelete={() => handleDelete(quote)}
                />
            ))}
            </div>
        </SortableContext>
        </DndContext>
    )}

      {modal && (
        <QuoteFormModal
          initial={modal.mode === 'edit' ? modal.quote : undefined}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
          onDelete={
            modal.mode === 'edit'
              ? () => handleDelete(modal.quote)
              : undefined
          }
        />
      )}
    </div>
  )
}
