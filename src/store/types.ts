export const SCHEMA_VERSION = 2

export type Stage =
  | 'saved'
  | 'applied'
  | 'interviewing'
  | 'finished'
  | 'ghosted'

export type EventType =
  | 'contact'
  | 'interview'
  | 'followup'
  | 'application'
  | 'task'

export type SkillKind = 'hard' | 'soft'

export interface Contact {
  id: string
  name: string
  role?: string
}

export interface InterviewItem {
  id: string
  label: string
  done: boolean
  notes?: string
}

export interface InterviewGuide {
  type?: string
  items: InterviewItem[]
}

export interface Process {
  id: string
  company: string
  role: string
  stage: Stage
  jobUrl?: string
  salaryNote?: string
  firstContactDate?: string
  contacts?: Contact[]
  interview?: InterviewGuide
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AppEvent {
  id: string
  processId?: string
  type: EventType
  date: string
  title: string
  notes?: string
  done: boolean
  createdAt: string
}

export interface Skill {
  id: string
  name: string
  kind: SkillKind
  obtained: boolean
  level?: number
  targetNotes?: string
  createdAt: string
}

export interface Link {
  id: string
  title: string
  url: string
  tags: string[]
  notes?: string
  createdAt: string
}

export interface QuestionCategory {
  id: string
  name: string
  createdAt: string
}

export interface Question {
  id: string
  categoryId: string
  question: string
  answer: string
  createdAt: string
}

export type ThemeSetting = 'light' | 'dark' | 'system'
export type Language = 'es' | 'en'

export function normalizeStage(stage: unknown): Stage {
  if (stage === 'offer' || stage === 'rejected') return 'finished'
  if (
    stage === 'saved' ||
    stage === 'applied' ||
    stage === 'interviewing' ||
    stage === 'finished' ||
    stage === 'ghosted'
  ) {
    return stage
  }
  return 'saved'
}

export interface DataState {
  schemaVersion: number
  processes: Process[]
  events: AppEvent[]
  skills: Skill[]
  links: Link[]
  questionCategories: QuestionCategory[]
  questions: Question[]
  lastExportAt: string | null
  theme: ThemeSetting
  lang: Language
}

export function emptyData(): DataState {
  return {
    schemaVersion: SCHEMA_VERSION,
    processes: [],
    events: [],
    skills: [],
    links: [],
    questionCategories: [],
    questions: [],
    lastExportAt: null,
    theme: 'system',
    lang: 'es',
  }
}
