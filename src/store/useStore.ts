import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  emptyData,
  SCHEMA_VERSION,
  type AppEvent,
  type DataState,
  type Process,
  type Skill,
} from './types'

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
  addEvent: (input: Omit<AppEvent, 'id' | 'createdAt'>) => AppEvent
  updateEvent: (
    id: string,
    patch: Partial<Omit<AppEvent, 'id' | 'createdAt'>>,
  ) => void
  deleteEvent: (id: string) => void
  addSkill: (input: Omit<Skill, 'id' | 'createdAt'>) => Skill
  updateSkill: (
    id: string,
    patch: Partial<Omit<Skill, 'id' | 'createdAt'>>,
  ) => void
  deleteSkill: (id: string) => void
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

      addEvent: (input) => {
        const event: AppEvent = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ events: [...s.events, event] }))
        return event
      },

      updateEvent: (id, patch) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      deleteEvent: (id) =>
        set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      addSkill: (input) => {
        const skill: Skill = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ skills: [...s.skills, skill] }))
        return skill
      },

      updateSkill: (id, patch) =>
        set((s) => ({
          skills: s.skills.map((sk) => (sk.id === id ? { ...sk, ...patch } : sk)),
        })),

      deleteSkill: (id) =>
        set((s) => ({ skills: s.skills.filter((sk) => sk.id !== id) })),
    }),
    {
      name: 'job-tracker-data',
      version: 1,
    },
  ),
)
