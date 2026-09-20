import { Link, Outlet, useParams } from '@tanstack/react-router'
import { lessons } from '../lessons'
import { isUnlocked, progressStore, useStore } from '../state/stores'

export function AppShell() {
  const { lessonId } = useParams({ strict: false })
  const completed = useStore(progressStore).completed
  const current = lessons.find(lesson => String(lesson.id) === lessonId)

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand" aria-label="State Quest, course map">
          STATE <span>QUEST</span>
        </Link>
        <div className="crumbs">
          {current ? (
            <>
              <span>{current.project}</span>
              <span className="crumb-sep" aria-hidden="true">
                /
              </span>
              <span className="crumb-current">Lesson {current.id}</span>
            </>
          ) : (
            <span className="crumb-current">Course map</span>
          )}
        </div>
        <nav className="progress" aria-label="Lesson progress">
          <span className="progress-count">
            {completed.length} of {lessons.length} complete
          </span>
          <ol className="dots">
            {lessons.map(lesson => {
              const done = completed.includes(lesson.id)
              const open = isUnlocked(lesson.prerequisite, completed)
              const label = `Lesson ${lesson.id}: ${lesson.title}${done ? ', complete' : open ? '' : ', locked'}`
              return (
                <li key={lesson.id}>
                  {open ? (
                    <Link
                      to="/lesson/$lessonId"
                      params={{ lessonId: String(lesson.id) }}
                      className={`dot${done ? ' done' : ''}${current?.id === lesson.id ? ' current' : ''}`}
                      aria-label={label}
                      aria-current={current?.id === lesson.id ? 'page' : undefined}
                      title={label}
                    />
                  ) : (
                    <span className="dot locked" role="img" aria-label={label} title={label} />
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
