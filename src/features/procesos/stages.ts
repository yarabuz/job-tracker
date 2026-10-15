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
    accent: 'border-sky-300 dark:border-sky-800',
    headerBg: 'bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  },
  {
    key: 'applied',
    labelKey: 'stages.applied',
    accent: 'border-indigo-300 dark:border-indigo-800',
    headerBg:
      'bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
  },
  {
    key: 'interviewing',
    labelKey: 'stages.interviewing',
    accent: 'border-amber-300 dark:border-amber-800',
    headerBg:
      'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  {
    key: 'offer',
    labelKey: 'stages.offer',
    accent: 'border-emerald-300 dark:border-emerald-800',
    headerBg:
      'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  {
    key: 'rejected',
    labelKey: 'stages.rejected',
    accent: 'border-rose-300 dark:border-rose-800',
    headerBg: 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
  },
  {
    key: 'ghosted',
    labelKey: 'stages.ghosted',
    accent: 'border-slate-300 dark:border-slate-600',
    headerBg:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
]
