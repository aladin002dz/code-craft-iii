import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { lessons } from '../lessons'
import { isUnlocked, progressStore, resetEverything, useStore } from '../state/stores'
import { BookIcon } from './BookIcon'
import { useI18n } from '../i18n/I18nProvider'
import { localizeLessons } from '../i18n/lessons'

export function CoursePage() {
  const { locale, copy } = useI18n()
  const localizedLessons = useMemo(() => localizeLessons(lessons, locale), [locale])
  const completed = useStore(progressStore).completed
  const [confirming, setConfirming] = useState(false)
  const nextLesson = localizedLessons.find(lesson => !completed.includes(lesson.id) && isUnlocked(lesson.prerequisite, completed))
  const finished = completed.length === localizedLessons.length

  return (
    <div className="course">
      <section className="course-intro">
        <div className="eyebrow">{copy.course.eyebrow}</div>
        <h1>{copy.course.title}</h1>
        <p>{copy.course.description}</p>
        <div className="intro-actions">
          <Link className="btn" to="/handbook"><BookIcon /> {copy.header.handbook}</Link>
        </div>
        {finished ? (
          <p className="course-done" role="status">
            {copy.course.allComplete}
          </p>
        ) : (
          nextLesson && (
            <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: String(nextLesson.id) }} data-testid="continue">
              {completed.length === 0 ? copy.course.start : copy.course.continue(nextLesson.id)} <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
            </Link>
          )
        )}
      </section>

      <ol className="lesson-map" aria-label={copy.course.lessonsLabel}>
        {localizedLessons.map(lesson => {
          const done = completed.includes(lesson.id)
          const open = isUnlocked(lesson.prerequisite, completed)
          const body = (
            <>
              <span className={`lesson-number${done ? ' done' : ''}`} aria-hidden="true">
                {done ? '✓' : lesson.id}
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
                  <span className="sr-only"> {copy.course.unlock(lesson.prerequisite!)}</span>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <div className="course-footer">
        {confirming ? (
          <span className="confirm-reset" role="alertdialog" aria-label={copy.course.resetQuestion}>
            {copy.course.resetQuestion}
            <button
              className="btn danger"
              onClick={() => {
                resetEverything()
                setConfirming(false)
              }}
            >
              {copy.course.erase}
            </button>
            <button className="btn" onClick={() => setConfirming(false)}>
              {copy.course.cancel}
            </button>
          </span>
        ) : (
          <button className="link-button" onClick={() => setConfirming(true)}>
            {copy.course.resetAll}
          </button>
        )}
      </div>
    </div>
  )
}
