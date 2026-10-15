import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import type { EventClickArg } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import { useTranslation } from 'react-i18next'
import type { AppEvent } from '../../store/types'
import { eventColor } from './eventMeta'

function toFcEvent(ev: AppEvent) {
  return {
    id: ev.id,
    title: ev.done ? `✓ ${ev.title}` : ev.title,
    start: ev.date,
    allDay: !ev.date.includes('T'),
    backgroundColor: eventColor(ev.type),
    borderColor: eventColor(ev.type),
    classNames: ev.done ? ['opacity-60'] : [],
    extendedProps: { type: ev.type, done: ev.done },
  }
}

export default function CalendarioView({
  events,
  onDateClick,
  onEventClick,
}: {
  events: AppEvent[]
  onDateClick: (arg: DateClickArg) => void
  onEventClick: (arg: EventClickArg) => void
}) {
  const { t, i18n } = useTranslation()
  const isEs = i18n.language === 'es'
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek',
        }}
        buttonText={{
          today: t('fullcalendar.today'),
          month: t('fullcalendar.month'),
          week: t('fullcalendar.week'),
          list: t('fullcalendar.list'),
        }}
        locale={isEs ? esLocale : undefined}
        firstDay={1}
        height="auto"
        events={events.map(toFcEvent)}
        dateClick={onDateClick}
        eventClick={onEventClick}
        nowIndicator
        dayMaxEvents={3}
      />
    </div>
  )
}
