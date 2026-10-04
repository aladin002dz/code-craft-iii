import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { courses, getLesson, lessonNumber } from '../lessons'
import { isUnlocked, progressStore, resetEverything, useStore } from '../state/stores'
import { BookIcon } from './BookIcon'
import { handbookPath } from './CoursePage'
import { useI18n } from '../i18n/I18nProvider'

/** Lists every course with its progress. Each course keeps its own map, handbook and lessons. */
export function HomePage() {
  const { locale, copy } = useI18n()
  const completed = useStore(progressStore).completed
  const [confirming, setConfirming] = useState(false)
  const arrow = locale === 'ar' ? '←' : '→'

  return (
    <div className="home">
      <section className="home-intro">
        <div className="eyebrow">{copy.home.eyebrow}</div>
        <h1>{copy.home.title}</h1>
        <p>{copy.home.description}</p>
      </section>

      <ol className="course-list" aria-label={copy.home.coursesLabel}>
        {courses.map((course, index) => {
          const text = copy.courses[course.id]
          const done = course.lessonIds.filter(id => completed.includes(id)).length
          const total = course.lessonIds.length
          const next = course.lessonIds.find(id => !completed.includes(id) && isUnlocked(getLesson(id)!.prerequisite, completed))
          const titleId = `course-${course.id}-title`
          return (
            <li key={course.id} className="course-card" data-course={course.id} data-testid={`course-${course.id}`}>
              <div className="course-card-head">
                <span className="course-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {index === 0 && done === 0 && <span className="course-badge">{copy.home.recommended}</span>}
              </div>
              <div className="eyebrow">{text.eyebrow}</div>
              <h2 id={titleId}>{text.name}</h2>
              <p>{text.title}</p>
              <div className="course-meta">
                <span>{copy.home.lessons(total)}</span>
                <span>{copy.home.progress(done, total)}</span>
              </div>
              <div className="course-meter" role="progressbar" aria-labelledby={titleId} aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
                <span style={{ width: `${(done / total) * 100}%` }} />
              </div>
              <div className="course-actions">
                <Link className="btn primary" to="/course/$courseId" params={{ courseId: course.id }} aria-describedby={titleId}>
                  {copy.home.open} <span aria-hidden="true">{arrow}</span>
                </Link>
                {next !== undefined && done > 0 && (
                  <Link className="btn" to="/lesson/$lessonId" params={{ lessonId: String(next) }}>
                    {copy.course.continue(lessonNumber(next))}
                  </Link>
                )}
                <Link className="btn ghost" to={handbookPath(course.id)} aria-describedby={titleId}>
                  <BookIcon /> {copy.header.handbook}
                </Link>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="course-footer">
        {confirming ? (
          <span className="confirm-reset" role="alertdialog" aria-label={copy.home.resetQuestion}>
            {copy.home.resetQuestion}
            <button
              className="btn danger"
              onClick={() => {
                resetEverything()
                setConfirming(false)
              }}
            >
              {copy.home.erase}
            </button>
            <button className="btn" onClick={() => setConfirming(false)}>
              {copy.home.cancel}
            </button>
          </span>
        ) : (
          <button className="link-button" onClick={() => setConfirming(true)}>
            {copy.home.resetAll}
          </button>
        )}
      </div>
    </div>
  )
}
