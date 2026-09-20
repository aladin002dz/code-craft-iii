import { describe, expect, it } from 'vitest'
import { lessons } from '../src/lessons'
import { checksByLesson } from '../src/frame/checks'
import { compileLearnerCode } from '../src/runtime/compile'
import { checkLesson } from './harness'
import { solutions } from './fixtures/curriculum'

describe('nine-lesson curriculum', () => {
  it('has ordered prerequisites and a matching check for every objective', () => {
    expect(lessons.map(lesson => lesson.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    for (const lesson of lessons) {
      expect(lesson.prerequisite).toBe(lesson.id === 1 ? null : lesson.id - 1)
      expect(lesson.objectives.map(item => item.id)).toEqual(checksByLesson[lesson.id].map(item => item.id))
      expect(compileLearnerCode(lesson.starter, lesson.filename).ok).toBe(true)
    }
  })

  for (const lesson of lessons) {
    it(`lesson ${lesson.id}: starter fails and a working implementation passes`, async () => {
      const starter = await checkLesson(lesson.id, lesson.starter)
      expect(Object.values(starter).some(result => !result.passed)).toBe(true)
      const solution = solutions[lesson.id](lesson.starter)
      const outcomes = await checkLesson(lesson.id, solution)
      expect(outcomes).toEqual(Object.fromEntries(lesson.objectives.map(objective => [objective.id, { passed: true, message: null }])))
    })
  }
})
