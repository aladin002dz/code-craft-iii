import { Link, useParams } from '@tanstack/react-router'
import { getLesson, lessonNumber, nextInCourse } from '../lessons'
import { isUnlocked, progressStore, useStore } from '../state/stores'
import { Workspace } from './Workspace'
import { useI18n } from '../i18n/I18nProvider'
import { localizeLesson } from '../i18n/lessons'
import { useMemo } from 'react'

export function LessonPage() {
  const { locale, copy } = useI18n()
  const { lessonId } = useParams({ from: '/lesson/$lessonId' })
  const completed = useStore(progressStore).completed
  const baseLesson = /^\d+$/.test(lessonId) ? getLesson(Number(lessonId)) : undefined
  const lesson = useMemo(() => (baseLesson ? localizeLesson(baseLesson, locale) : undefined), [baseLesson, locale])

  if (!lesson) {
    return (
      <div className="notice">
        <h1>{copy.lesson.notFound}</h1>
        <p>{copy.lesson.notFoundBody(lessonId)}</p>
        <Link className="btn primary" to="/">
          {copy.lesson.back}
        </Link>
      </div>
    )
  }

  if (!isUnlocked(lesson.prerequisite, completed)) {
    const beforeBase = getLesson(lesson.prerequisite!)
    const before = beforeBase ? localizeLesson(beforeBase, locale) : undefined
    return (
      <div className="notice" data-testid="locked">
        <h1>{copy.lesson.lockedTitle(lessonNumber(lesson.id))}</h1>
        <p>{copy.lesson.lockedBody(lessonNumber(lesson.prerequisite!), before?.title ?? '', lesson.title)}</p>
        <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: String(lesson.prerequisite) }}>
          {copy.lesson.goTo(lessonNumber(lesson.prerequisite!))}
        </Link>
      </div>
    )
  }

  // Keyed so switching lessons never carries editor, preview, or check state across.
  const nextBase = nextInCourse(lesson)
  return <Workspace key={lesson.id} lesson={lesson} next={nextBase ? localizeLesson(nextBase, locale) : null} />
}
