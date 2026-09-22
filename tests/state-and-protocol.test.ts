import { describe, expect, it } from 'vitest'
import { createStore } from '../src/state/storage'
import { parseDrafts, parsePreferences, parseProgress } from '../src/state/stores'
import { deriveStatus } from '../src/runtime/status'
import { CHANNEL, parseFrameMessage, parseHostMessage } from '../src/frame/protocol'

describe('saved work', () => {
  it('recovers from invalid JSON, old versions, and unavailable storage', () => {
    const memory = new Map<string, string>()
    const storage = () => ({
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => { memory.set(key, value) },
    }) as Storage
    const options = { key: 'test-progress', version: 1, initial: () => ({ completed: [] as number[] }), parse: parseProgress, storage }
    memory.set(options.key, '{bad json')
    expect(createStore(options).get()).toEqual({ completed: [] })
    memory.set(options.key, JSON.stringify({ version: 0, data: { completed: [1] } }))
    expect(createStore(options).get()).toEqual({ completed: [] })
    const store = createStore(options)
    store.set({ completed: [1] })
    expect(createStore(options).get()).toEqual({ completed: [1] })
    const blocked = createStore({ ...options, storage: () => { throw new Error('blocked') } })
    blocked.set({ completed: [2] })
    expect(blocked.get()).toEqual({ completed: [2] })
  })

  it('drops invalid lesson ids and oversized drafts', () => {
    expect(parseProgress({ completed: [2, 1, 2, 0, 10, '3'] })).toEqual({ completed: [1, 2] })
    expect(parseDrafts({ 1: 'valid', 2: 'x'.repeat(50_001), 10: 'wrong id' })).toEqual({ 1: 'valid' })
    expect(parsePreferences({ sidebarCollapsed: 'yes' })).toEqual({ sidebarCollapsed: false, locale: 'en' })
    expect(parsePreferences({ sidebarCollapsed: true, locale: 'ar' })).toEqual({ sidebarCollapsed: true, locale: 'ar' })
  })
})

describe('completion state', () => {
  const objectives = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]
  it('uses the checked code for the checklist and keeps earned completion after edits', () => {
    const run = { code: 'working', outcomes: { a: { passed: true, message: null }, b: { passed: true, message: null } } }
    const passing = deriveStatus(objectives, 'working', run, false)
    expect(passing.allPassed).toBe(true)
    expect(passing.headline).toBe('complete')
    const edited = deriveStatus(objectives, 'changed', run, passing.completed)
    expect(edited.headline).toBe('edited-after-complete')
    expect(edited.objectives.map(item => item.state)).toEqual(['pending', 'pending'])
    expect(edited.completed).toBe(true)
  })
})

describe('preview message validation', () => {
  it('rejects malformed or oversized messages from the frame', () => {
    expect(parseFrameMessage({ channel: 'other', kind: 'ready' })).toBeNull()
    expect(parseFrameMessage({ channel: CHANNEL, kind: 'state', token: 'x', snapshot: [{ component: 'A', key: null, values: [Infinity] }] })).toBeNull()
    expect(parseFrameMessage({ channel: CHANNEL, kind: 'checks', token: 'x', results: [{ id: 'a', passed: 'yes', message: null }] })).toBeNull()
    expect(parseFrameMessage({ channel: CHANNEL, kind: 'runtime-error', token: 'x', message: 'x'.repeat(2001) })).toBeNull()
    expect(parseFrameMessage({ channel: CHANNEL, kind: 'rendered', token: 'x' })).toEqual({ channel: CHANNEL, kind: 'rendered', token: 'x' })
  })

  it('validates messages sent into the sandbox', () => {
    expect(parseHostMessage({ channel: CHANNEL, kind: 'init', token: 'x', code: 'hello', lessonId: 1 })).toMatchObject({ kind: 'init', lessonId: 1 })
    expect(parseHostMessage({ channel: CHANNEL, kind: 'init', token: 'x', code: 'hello', lessonId: '1' })).toBeNull()
    expect(parseHostMessage({ channel: CHANNEL, kind: 'run-checks', token: 3 })).toBeNull()
  })
})
