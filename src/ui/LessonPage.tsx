import { Link, useParams } from '@tanstack/react-router'
import { getLesson, lessons } from '../lessons'
import { isUnlocked, progressStore, useStore } from '../state/stores'
import { Workspace } from './Workspace'

export function LessonPage() {
  const { lessonId } = useParams({ from: '/lesson/$lessonId' })
  const completed = useStore(progressStore).completed
  const lesson = /^\d+$/.test(lessonId) ? getLesson(Number(lessonId)) : undefined

  if (!lesson) {
    return (
      <div className="notice">
        <h1>Lesson not found</h1>
        <p>There is no lesson “{lessonId}”. Lessons are numbered 1 to {lessons.length}.</p>
        <Link className="btn primary" to="/">
          Back to the course map
        </Link>
      </div>
    )
  }

  if (!isUnlocked(lesson.prerequisite, completed)) {
    const before = getLesson(lesson.prerequisite!)
    return (
      <div className="notice" data-testid="locked">
        <h1>Lesson {lesson.id} is locked</h1>
        <p>
          Finish lesson {before?.id}, “{before?.title}”, to unlock “{lesson.title}”.
        </p>
        <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: String(lesson.prerequisite) }}>
          Go to lesson {lesson.prerequisite}
        </Link>
      </div>
    )
  }

  // Keyed so switching lessons never carries editor, preview, or check state across.
  return <Workspace key={lesson.id} lesson={lesson} next={getLesson(lesson.id + 1) ?? null} />
}
