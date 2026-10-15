import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { emptyData, SCHEMA_VERSION, type DataState } from './types'

interface StoreActions {
  replaceAll: (data: DataState) => void
  markExported: () => void
  resetAll: () => void
}

export type Store = DataState & StoreActions

export const useStore = create<Store>()(
  persist(
    (set) => ({
      ...emptyData(),

      replaceAll: (data) =>
        set({
          schemaVersion: SCHEMA_VERSION,
          processes: data.processes,
          events: data.events,
          skills: data.skills,
          links: data.links,
        }),

      markExported: () => set({ lastExportAt: new Date().toISOString() }),

      resetAll: () => set({ ...emptyData() }),
    }),
    {
      name: 'job-tracker-data',
      version: 1,
    },
  ),
)
