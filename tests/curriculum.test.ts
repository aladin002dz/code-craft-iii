import { describe, expect, it } from 'vitest'
import { courses, lessons } from '../src/lessons'
import { checksByLesson } from '../src/frame/checks'
import { compileLearnerCode } from '../src/runtime/compile'
import { checkLesson } from './harness'
import { solutions } from './fixtures/curriculum'

describe('state and effects curricula', () => {
  it('has ordered prerequisites within each course and a matching check for every objective', () => {
    expect(courses.map(course => [course.id, course.lessonIds])).toEqual([
      ['state', [1, 2, 3, 4, 5, 6, 7, 8, 9]],
      ['effects', [10, 11, 12, 13, 14, 15, 16]],
    ])
    for (const lesson of lessons) {
      const first = courses.find(course => course.id === lesson.course)!.lessonIds[0]
      expect(lesson.prerequisite).toBe(lesson.id === first ? null : lesson.id - 1)
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
