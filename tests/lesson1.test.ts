import { describe, expect, it } from 'vitest'
import { checkLesson } from './harness'
import { lessons } from '../src/lessons'
import * as fixtures from './fixtures/lesson1'

const starter = lessons[0].starter
const failedIds = (results: Awaited<ReturnType<typeof checkLesson>>) =>
  Object.entries(results)
    .filter(([, outcome]) => !outcome.passed)
    .map(([id]) => id)

describe('lesson 1: theme toggle', () => {
  it('starter visibly fails the intended behaviour', async () => {
    const results = await checkLesson(1, starter)
    expect(failedIds(results)).toEqual(['toggles-state', 'theme-follows-state', 'label-follows-state'])
    expect(results['toggles-state'].message).toMatch(/setIsDark inside handleToggle/)
  })

  it.each([
    ['flip with !', fixtures.solution],
    ['functional update', fixtures.solutionFunctional],
    ['if/else with a local variable', fixtures.solutionVerbose],
  ])('accepts a correct solution: %s', async (_name, code) => {
    expect(failedIds(await checkLesson(1, code()))).toEqual([])
  })

  it('rejects a handler that only ever sets true, with a specific message', async () => {
    const results = await checkLesson(1, fixtures.alwaysTrue())
    expect(results['toggles-state'].passed).toBe(false)
    expect(results['toggles-state'].message).toMatch(/second click/)
  })

  it('rejects a label that ignores state while the state toggles', async () => {
    const results = await checkLesson(1, fixtures.labelIgnoresState())
    expect(results['toggles-state'].passed).toBe(true)
    expect(results['theme-follows-state'].passed).toBe(true)
    expect(results['label-follows-state'].passed).toBe(false)
  })

  it('rejects a theme that ignores state while the state toggles', async () => {
    const results = await checkLesson(1, fixtures.themeIgnoresState())
    expect(results['toggles-state'].passed).toBe(true)
    expect(results['theme-follows-state'].passed).toBe(false)
    expect(results['label-follows-state'].passed).toBe(true)
  })

  it('reports a runtime error thrown by an event handler', async () => {
    const results = await checkLesson(1, fixtures.throwsOnClick())
    expect(results['toggles-state'].message).toMatch(/threw an error: boom/)
  })
})
