import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import type { DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store/useStore'
import type { AppEvent } from '../store/types'
import CalendarioView from '../features/calendario/CalendarioView'
import EventFormModal, {
  type EventFormValues,
} from '../features/calendario/EventFormModal'

type ModalState =
  | { mode: 'new'; defaultDate?: string }
  | { mode: 'edit'; event: AppEvent }
  | null

export default function CalendarioPage() {
  const { t } = useTranslation()
  const events = useStore((s) => s.events)
  const processes = useStore((s) => s.processes)
  const addEvent = useStore((s) => s.addEvent)
  const updateEvent = useStore((s) => s.updateEvent)
  const deleteEvent = useStore((s) => s.deleteEvent)
  const [modal, setModal] = useState<ModalState>(null)

  const handleSubmit = (values: EventFormValues) => {
    if (modal?.mode === 'edit') {
      updateEvent(modal.event.id, values)
    } else {
      addEvent({ ...values })
    }
    setModal(null)
  }

  const handleDelete = () => {
    if (modal?.mode !== 'edit') return
    if (!window.confirm(t('calendario.confirmDelete'))) return
    deleteEvent(modal.event.id)
    setModal(null)
  }

  const handleEventClick = (arg: EventClickArg) => {
    const ev = events.find((e) => e.id === arg.event.id)
    if (ev) setModal({ mode: 'edit', event: ev })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          title={t('pages.calendario.title')}
          subtitle={t('pages.calendario.subtitle')}
        />
        <button
          type="button"
          onClick={() => setModal({ mode: 'new' })}
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          {t('calendario.new')}
        </button>
      </div>

      <CalendarioView
        events={events}
        onDateClick={(arg: DateClickArg) =>
          setModal({ mode: 'new', defaultDate: arg.dateStr })
        }
        onEventClick={handleEventClick}
      />

      {modal && (
        <EventFormModal
          initial={modal.mode === 'edit' ? modal.event : undefined}
          defaultDate={modal.mode === 'new' ? modal.defaultDate : undefined}
          processes={processes}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
          onDelete={modal.mode === 'edit' ? handleDelete : undefined}
        />
      )}
    </div>
  )
}
