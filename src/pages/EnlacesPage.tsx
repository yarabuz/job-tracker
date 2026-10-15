import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import type { Link } from '../store/types'
import LinkFormModal, {
  type LinkFormValues,
} from '../features/enlaces/LinkFormModal'

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
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)

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

  const handleDelete = () => {
    if (modal?.mode !== 'edit') return
    if (!window.confirm(t('links.confirmDelete'))) return
    deleteLink(modal.link.id)
    setModal(null)
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
            className="w-64 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTagFilter(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              tagFilter === null
                ? 'bg-sky-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
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
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          {search || tagFilter ? t('links.noResults') : t('links.empty')}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((link) => (
            <div
              key={link.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:underline"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  <span className="truncate">{link.title}</span>
                </a>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => setModal({ mode: 'edit', link })}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label={t('procesos.edit')}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(t('links.confirmDelete'))) {
                        deleteLink(link.id)
                      }
                    }}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={t('common.delete')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-1 truncate text-xs text-slate-400">{link.url}</p>
              {link.notes && (
                <p className="mt-2 text-xs text-slate-600">{link.notes}</p>
              )}
              {link.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {link.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <LinkFormModal
          initial={modal.mode === 'edit' ? modal.link : undefined}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
          onDelete={modal.mode === 'edit' ? handleDelete : undefined}
        />
      )}
    </div>
  )
}
