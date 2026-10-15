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
import type { Link } from '../store/types'
import LinkFormModal, {
  type LinkFormValues,
} from '../features/enlaces/LinkFormModal'
import SortableLinkCard from '../features/enlaces/SortableLinkCard'

type ModalState =
  | { mode: 'new' }
  | { mode: 'edit'; link: Link }
  | null

export default function EnlacesPage() {
  const { t } = useTranslation()
  const links = useStore((s) => s.links)
  const addLink = useStore((s) => s.addLink)
  const updateLink = useStore((s) => s.updateLink)
  const deleteLink = useStore((s) => s.deleteLink)
  const reorderLinks = useStore((s) => s.reorderLinks)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const isFiltered = search.trim() !== '' || tagFilter !== null

  const allTags = useMemo(() => {
    const set = new Set<string>()
    links.forEach((l) => l.tags.forEach((tag) => set.add(tag)))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [links])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return links.filter((l) => {
      if (tagFilter && !l.tags.includes(tagFilter)) return false
      if (!q) return true
      return (
        l.title.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q) ||
        l.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (l.notes ?? '').toLowerCase().includes(q)
      )
    })
  }, [links, search, tagFilter])

  const handleSubmit = (values: LinkFormValues) => {
    if (modal?.mode === 'edit') {
      updateLink(modal.link.id, values)
    } else {
      addLink(values)
    }
    setModal(null)
  }

  const handleDelete = (link: Link) => {
    if (window.confirm(t('links.confirmDelete'))) {
      deleteLink(link.id)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderLinks(String(active.id), String(over.id))
  }

  return (
    <div>
      <PageHeader
        title={t('pages.enlaces.title')}
        subtitle={t('pages.enlaces.subtitle')}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setModal({ mode: 'new' })}
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          {t('links.new')}
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
        {!isFiltered && links.length > 1 && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {t('links.dragHint')}
          </span>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTagFilter(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              tagFilter === null
                ? 'bg-sky-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {t('links.allTags')}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                tagFilter === tag
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

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
              {filtered.map((link) => (
                <SortableLinkCard
                  key={link.id}
                  link={link}
                  disabled={isFiltered}
                  onEdit={() => setModal({ mode: 'edit', link })}
                  onDelete={() => handleDelete(link)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {modal && (
        <LinkFormModal
          initial={modal.mode === 'edit' ? modal.link : undefined}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
          onDelete={
            modal.mode === 'edit'
              ? () => handleDelete(modal.link)
              : undefined
          }
        />
      )}
    </div>
  )
}
