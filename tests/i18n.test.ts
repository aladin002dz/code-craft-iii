import { describe, expect, it } from 'vitest'
import { lessons } from '../src/lessons'
import { localizeLessons } from '../src/i18n/lessons'
import { uiCopy } from '../src/i18n/ui'

describe('tutorial localization', () => {
  it('provides complete French and Arabic curriculum overlays without changing learner code', () => {
    for (const locale of ['fr', 'ar'] as const) {
      const localized = localizeLessons(lessons, locale)
      expect(localized).toHaveLength(9)
      expect(localized.map(lesson => lesson.id)).toEqual(lessons.map(lesson => lesson.id))
      localized.forEach((lesson, index) => {
        expect(lesson.title).not.toBe(lessons[index].title)
        expect(lesson.steps.length).toBe(lessons[index].steps.length)
        expect(lesson.objectives.map(item => item.id)).toEqual(lessons[index].objectives.map(item => item.id))
        expect(lesson.starter).toBe(lessons[index].starter)
        expect(lesson.focus).toBe(lessons[index].focus)
      })
    }
  })

  it('has localized navigation and workspace copy for all three languages', () => {
    expect(uiCopy.en.workspace.runChecks).toBe('Run checks')
    expect(uiCopy.fr.workspace.runChecks).toBe('Lancer les vérifications')
    expect(uiCopy.ar.workspace.runChecks).toBe('تشغيل الاختبارات')
  })
})
