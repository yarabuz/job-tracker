import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  emptyData,
  SCHEMA_VERSION,
  type AppEvent,
  type DataState,
  type Language,
  type Link,
  type Process,
  type Question,
  type QuestionCategory,
  type Skill,
  type ThemeSetting,
} from './types'

interface StoreActions {
  replaceAll: (data: DataState) => void
  markExported: () => void
  resetAll: () => void
  setTheme: (theme: ThemeSetting) => void
  setLang: (lang: Language) => void
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
  addLink: (input: Omit<Link, 'id' | 'createdAt'>) => Link
  updateLink: (
    id: string,
    patch: Partial<Omit<Link, 'id' | 'createdAt'>>,
  ) => void
  deleteLink: (id: string) => void
  reorderLinks: (activeId: string, overId: string) => void
  addQuestionCategory: (input: Omit<QuestionCategory, 'id' | 'createdAt'>) => QuestionCategory
  updateQuestionCategory: (id: string, name: string) => void
  deleteQuestionCategory: (id: string) => void
  addQuestion: (input: Omit<Question, 'id' | 'createdAt'>) => Question
  updateQuestion: (
    id: string,
    patch: Partial<Omit<Question, 'id' | 'createdAt'>>,
  ) => void
  deleteQuestion: (id: string) => void
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
          questionCategories: data.questionCategories,
          questions: data.questions,
          theme: data.theme,
          lang: data.lang,
        }),

      markExported: () => set({ lastExportAt: new Date().toISOString() }),

      resetAll: () => {
        const { theme, lang } = useStore.getState()
        set({ ...emptyData(), theme, lang })
      },

      setTheme: (theme) => set({ theme }),

      setLang: (lang) => set({ lang }),

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

      addLink: (input) => {
        const link: Link = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ links: [...s.links, link] }))
        return link
      },

      updateLink: (id, patch) =>
        set((s) => ({
          links: s.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),

      deleteLink: (id) =>
        set((s) => ({ links: s.links.filter((l) => l.id !== id) })),

      reorderLinks: (activeId, overId) =>
        set((s) => {
          const from = s.links.findIndex((l) => l.id === activeId)
          const to = s.links.findIndex((l) => l.id === overId)
          if (from === -1 || to === -1 || from === to) return s
          const links = [...s.links]
          const [moved] = links.splice(from, 1)
          links.splice(to, 0, moved)
          return { links }
        }),

      addQuestionCategory: (input) => {
        const category: QuestionCategory = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ questionCategories: [...s.questionCategories, category] }))
        return category
      },

      updateQuestionCategory: (id, name) =>
        set((s) => ({
          questionCategories: s.questionCategories.map((c) =>
            c.id === id ? { ...c, name } : c,
          ),
        })),

      deleteQuestionCategory: (id) =>
        set((s) => ({
          questionCategories: s.questionCategories.filter((c) => c.id !== id),
          questions: s.questions.filter((q) => q.categoryId !== id),
        })),

      addQuestion: (input) => {
        const question: Question = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ questions: [...s.questions, question] }))
        return question
      },

      updateQuestion: (id, patch) =>
        set((s) => ({
          questions: s.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
        })),

      deleteQuestion: (id) =>
        set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),
    }),
    {
      name: 'job-tracker-data',
      version: 1,
    },
  ),
)
