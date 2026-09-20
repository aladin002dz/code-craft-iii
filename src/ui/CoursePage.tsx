import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { lessons } from '../lessons'
import { isUnlocked, progressStore, resetEverything, useStore } from '../state/stores'

export function CoursePage() {
  const completed = useStore(progressStore).completed
  const [confirming, setConfirming] = useState(false)
  const nextLesson = lessons.find(lesson => !completed.includes(lesson.id) && isUnlocked(lesson.prerequisite, completed))
  const finished = completed.length === lessons.length

  return (
    <div className="course">
      <section className="course-intro">
        <div className="eyebrow">React state, hands on</div>
        <h1>Learn state by finishing real features</h1>
        <p>
          Nine short exercises across three small projects. Edit real React code, watch the live preview respond, and pass behaviour checks.
          Your progress and drafts stay in this browser.
        </p>
        {finished ? (
          <p className="course-done" role="status">
            All nine lessons complete.
          </p>
        ) : (
          nextLesson && (
            <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: String(nextLesson.id) }} data-testid="continue">
              {completed.length === 0 ? 'Start lesson 1' : `Continue with lesson ${nextLesson.id}`} <span aria-hidden="true">→</span>
            </Link>
          )
        )}
      </section>

      <ol className="lesson-map" aria-label="Lessons">
        {lessons.map(lesson => {
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
              <span className="lesson-state">{done ? 'Complete' : open ? 'Ready' : 'Locked'}</span>
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
                  <span className="sr-only"> Complete lesson {lesson.prerequisite} to unlock.</span>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <div className="course-footer">
        {confirming ? (
          <span className="confirm-reset" role="alertdialog" aria-label="Confirm progress reset">
            Erase all progress and saved code in this browser?
            <button
              className="btn danger"
              onClick={() => {
                resetEverything()
                setConfirming(false)
              }}
            >
              Yes, erase
            </button>
            <button className="btn" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </span>
        ) : (
          <button className="link-button" onClick={() => setConfirming(true)}>
            Reset all progress
          </button>
        )}
      </div>
    </div>
  )
}
