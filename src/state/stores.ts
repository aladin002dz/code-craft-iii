import { useSyncExternalStore } from 'react'
import { createStore, isRecord, type Store } from './storage'

export const LESSON_COUNT = 9
const MAX_DRAFT_LENGTH = 50_000

const isLessonId = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 1 && (value as number) <= LESSON_COUNT

/** Which lessons are complete. Application progress, separate from what learners typed. */
export type Progress = { completed: number[] }
/** Learner code, keyed by lesson id. */
export type Drafts = Record<string, string>
/** Interface preferences. */
export type Locale = 'en' | 'fr' | 'ar'
export type Preferences = { sidebarCollapsed: boolean; locale: Locale }

export const parseProgress = (raw: unknown): Progress | null => {
  if (!isRecord(raw) || !Array.isArray(raw.completed)) return null
  return { completed: [...new Set(raw.completed.filter(isLessonId))].sort((a, b) => a - b) }
}

export const parseDrafts = (raw: unknown): Drafts | null => {
  if (!isRecord(raw)) return null
  const drafts: Drafts = {}
  for (const [key, code] of Object.entries(raw)) {
    if (isLessonId(Number(key)) && typeof code === 'string' && code.length <= MAX_DRAFT_LENGTH) drafts[key] = code
  }
  return drafts
}

export const parsePreferences = (raw: unknown): Preferences | null =>
  isRecord(raw)
    ? {
        sidebarCollapsed: raw.sidebarCollapsed === true,
        locale: raw.locale === 'fr' || raw.locale === 'ar' ? raw.locale : 'en',
      }
    : null

const PREFIX = 'state-quest'

export const progressStore: Store<Progress> = createStore({
  key: `${PREFIX}:progress`,
  version: 1,
  initial: () => ({ completed: [] }),
  parse: parseProgress,
})

export const draftStore: Store<Drafts> = createStore({
  key: `${PREFIX}:drafts`,
  version: 1,
  initial: () => ({}),
  parse: parseDrafts,
})

export const preferenceStore: Store<Preferences> = createStore({
  key: `${PREFIX}:preferences`,
  version: 1,
  initial: () => ({ sidebarCollapsed: false, locale: 'en' }),
  parse: parsePreferences,
})

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get)
}

export function markComplete(lessonId: number) {
  const { completed } = progressStore.get()
  if (!completed.includes(lessonId)) progressStore.set({ completed: [...completed, lessonId].sort((a, b) => a - b) })
}

export function saveDraft(lessonId: number, code: string) {
  draftStore.set({ ...draftStore.get(), [lessonId]: code })
}

export function clearDraft(lessonId: number) {
  const drafts = draftStore.get()
  if (!(lessonId in drafts)) return
  const rest = { ...drafts }
  delete rest[lessonId]
  draftStore.set(rest)
}

export function resetEverything() {
  progressStore.set({ completed: [] })
  draftStore.set({})
}

/** A lesson is playable once its prerequisite is complete. */
export function isUnlocked(prerequisite: number | null, completed: number[]) {
  return prerequisite === null || completed.includes(prerequisite)
}

// Keep tabs in sync: another tab may complete a lesson or edit a draft.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', event => {
    if (event.key?.startsWith(`${PREFIX}:`)) {
      progressStore.reload()
      draftStore.reload()
      preferenceStore.reload()
    }
  })
}
