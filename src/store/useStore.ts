import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { emptyData, SCHEMA_VERSION, type DataState, type Process } from './types'

interface StoreActions {
  replaceAll: (data: DataState) => void
  markExported: () => void
  resetAll: () => void
  addProcess: (
    input: Omit<Process, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Process
  updateProcess: (
    id: string,
    patch: Partial<Omit<Process, 'id' | 'createdAt'>>,
  ) => void
  deleteProcess: (id: string) => void
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

      addProcess: (input) => {
        const now = new Date().toISOString()
        const process: Process = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        }
        set((s) => ({ processes: [...s.processes, process] }))
        return process
      },

      updateProcess: (id, patch) =>
        set((s) => ({
          processes: s.processes.map((p) =>
            p.id === id
              ? { ...p, ...patch, updatedAt: new Date().toISOString() }
              : p,
          ),
        })),

      deleteProcess: (id) =>
        set((s) => ({
          processes: s.processes.filter((p) => p.id !== id),
          events: s.events.filter((e) => e.processId !== id),
        })),
    }),
    {
      name: 'job-tracker-data',
      version: 1,
    },
  ),
)
