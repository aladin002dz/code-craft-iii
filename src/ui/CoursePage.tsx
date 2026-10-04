import { Link, useParams } from '@tanstack/react-router'
import { useMemo } from 'react'
import { courseLessons, isCourseId, lessonNumber, lessons } from '../lessons'
import { isUnlocked, progressStore, useStore } from '../state/stores'
import { BookIcon } from './BookIcon'
import { useI18n } from '../i18n/I18nProvider'
import { localizeLessons } from '../i18n/lessons'
import type { CourseId } from '../lessons/types'

export const handbookPath = (course: CourseId) => (course === 'effects' ? '/handbook/effects' : '/handbook')

export function CoursePage() {
  const { courseId } = useParams({ from: '/course/$courseId' })
  const { copy } = useI18n()
  if (!isCourseId(courseId)) {
    return (
      <div className="notice">
        <h1>{copy.lesson.notFound}</h1>
        <Link className="btn primary" to="/">
          {copy.lesson.back}
        </Link>
      </div>
    )
  }
  return <CourseMap course={courseId} />
}

function CourseMap({ course }: { course: CourseId }) {
  const { locale, copy } = useI18n()
  const localizedLessons = useMemo(() => courseLessons(localizeLessons(lessons, locale), course), [locale, course])
  const completed = useStore(progressStore).completed
  const nextLesson = localizedLessons.find(lesson => !completed.includes(lesson.id) && isUnlocked(lesson.prerequisite, completed))
  const doneHere = localizedLessons.filter(lesson => completed.includes(lesson.id)).length
  const finished = doneHere === localizedLessons.length
  const text = copy.courses[course]

  return (
    <div className="course" data-course={course}>
      <section className="course-intro">
        <Link className="back-link" to="/">
          <span aria-hidden="true">{locale === 'ar' ? '→' : '←'}</span> {copy.course.allCourses}
        </Link>
        <div className="eyebrow">{text.eyebrow}</div>
        <h1>{text.title}</h1>
        <p>{text.description}</p>
        <div className="intro-actions">
          <Link className="btn" to={handbookPath(course)}><BookIcon /> {copy.header.handbook}</Link>
        </div>
        {finished ? (
          <p className="course-done" role="status">
            {text.allComplete}
          </p>
        ) : (
          nextLesson && (
            <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: String(nextLesson.id) }} data-testid="continue">
              {doneHere === 0 ? copy.course.start : copy.course.continue(lessonNumber(nextLesson.id))} <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
            </Link>
          )
        )}
      </section>

      <ol className="lesson-map" aria-label={copy.course.lessonsLabel}>
        {localizedLessons.map(lesson => {
          const done = completed.includes(lesson.id)
          const open = isUnlocked(lesson.prerequisite, completed)
          const number = lessonNumber(lesson.id)
          const body = (
            <>
              <span className={`lesson-number${done ? ' done' : ''}`} aria-hidden="true">
                {done ? '✓' : number}
              </span>
              <span className="lesson-text">
                <span className="lesson-topic">{lesson.topic}</span>
                <span className="lesson-title">{lesson.title}</span>
                <span className="lesson-project">{lesson.project}</span>
              </span>
              <span className="lesson-state">{done ? copy.course.complete : open ? copy.course.ready : copy.course.locked}</span>
            </>
          )
          return (
            <li key={lesson.id}>
              {open ? (
                <Link className="lesson-card" to="/lesson/$lessonId" params={{ lessonId: String(lesson.id) }}>
                  {body}
                </Link>
              ) : (
                <div className="lesson-card locked" aria-disabled="true">
                  {body}
                  <span className="sr-only"> {copy.course.unlock(lessonNumber(lesson.prerequisite!))}</span>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
