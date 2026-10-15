import type { EventType } from '../../store/types'

export interface EventMeta {
  key: EventType
  labelKey: string
  color: string
}

export const EVENT_TYPES: EventMeta[] = [
  { key: 'contact', labelKey: 'eventTypes.contact', color: '#0284c7' },
  { key: 'interview', labelKey: 'eventTypes.interview', color: '#d97706' },
  { key: 'followup', labelKey: 'eventTypes.followup', color: '#7c3aed' },
  { key: 'application', labelKey: 'eventTypes.application', color: '#4f46e5' },
  { key: 'task', labelKey: 'eventTypes.task', color: '#059669' },
]

export function eventColor(type: EventType): string {
  return EVENT_TYPES.find((e) => e.key === type)?.color ?? '#64748b'
}
