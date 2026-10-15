import type { Stage } from '../../store/types'

export interface StageMeta {
  key: Stage
  labelKey: string
  accent: string
  headerBg: string
}

export const STAGES: StageMeta[] = [
  {
    key: 'saved',
    labelKey: 'stages.saved',
    accent: 'border-sky-300',
    headerBg: 'bg-sky-50 text-sky-800',
  },
  {
    key: 'applied',
    labelKey: 'stages.applied',
    accent: 'border-indigo-300',
    headerBg: 'bg-indigo-50 text-indigo-800',
  },
  {
    key: 'interviewing',
    labelKey: 'stages.interviewing',
    accent: 'border-amber-300',
    headerBg: 'bg-amber-50 text-amber-800',
  },
  {
    key: 'offer',
    labelKey: 'stages.offer',
    accent: 'border-emerald-300',
    headerBg: 'bg-emerald-50 text-emerald-800',
  },
  {
    key: 'rejected',
    labelKey: 'stages.rejected',
    accent: 'border-rose-300',
    headerBg: 'bg-rose-50 text-rose-800',
  },
  {
    key: 'ghosted',
    labelKey: 'stages.ghosted',
    accent: 'border-slate-300',
    headerBg: 'bg-slate-100 text-slate-600',
  },
]
