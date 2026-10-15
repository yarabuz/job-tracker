import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Search } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import type { Process } from '../store/types'
import KanbanBoard from '../features/procesos/KanbanBoard'
import ProcessFormModal, {
  type ProcessFormValues,
} from '../features/procesos/ProcessFormModal'

export default function ProcesosPage() {
  const { t } = useTranslation()
  const processes = useStore((s) => s.processes)
  const addProcess = useStore((s) => s.addProcess)
  const updateProcess = useStore((s) => s.updateProcess)
  const deleteProcess = useStore((s) => s.deleteProcess)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ mode: 'new' } | { mode: 'edit'; process: Process } | null>(
    null,
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return processes
    return processes.filter(
      (p) =>
        p.company.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        (p.notes ?? '').toLowerCase().includes(q),
    )
  }, [processes, search])

  const handleSubmit = (values: ProcessFormValues) => {
    if (modal?.mode === 'edit') {
      updateProcess(modal.process.id, values)
    } else {
      addProcess(values)
    }
    setModal(null)
  }

  const handleDelete = () => {
    if (modal?.mode !== 'edit') return
    if (!window.confirm(t('procesos.confirmDelete'))) return
    deleteProcess(modal.process.id)
    setModal(null)
  }

  return (
    <div>
      <PageHeader
        title={t('pages.procesos.title')}
        subtitle={t('pages.procesos.subtitle')}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setModal({ mode: 'new' })}
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          {t('procesos.new')}
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder={t('procesos.searchPlaceholder')}
            className="w-64 rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          {search ? t('procesos.noResults') : t('procesos.empty')}
        </div>
      ) : (
        <KanbanBoard
          processes={filtered}
          onEdit={(p) => setModal({ mode: 'edit', process: p })}
        />
      )}

      {modal && (
        <ProcessFormModal
          initial={modal.mode === 'edit' ? modal.process : undefined}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
          onDelete={modal.mode === 'edit' ? handleDelete : undefined}
        />
      )}
    </div>
  )
}
