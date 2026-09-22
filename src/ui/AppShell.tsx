import { Link, Outlet, useParams, useLocation } from '@tanstack/react-router'
import { lessons } from '../lessons'
import { isUnlocked, progressStore, useStore } from '../state/stores'
import { BookIcon } from './BookIcon'
import { useI18n } from '../i18n/I18nProvider'
import { localizeLessons } from '../i18n/lessons'
import type { Locale } from '../state/stores'
import { useMemo } from 'react'

export function AppShell() {
  const { locale, copy, setLocale } = useI18n()
  const localizedLessons = useMemo(() => localizeLessons(lessons, locale), [locale])
  const { lessonId } = useParams({ strict: false })
  const pathname = useLocation({ select: location => location.pathname })
  const completed = useStore(progressStore).completed
  const current = localizedLessons.find(lesson => String(lesson.id) === lessonId)

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand" aria-label={copy.header.brandLabel}>
          STATE <span>QUEST</span>
        </Link>
        <div className="crumbs">
          {current ? (
            <>
              <span>{current.project}</span>
              <span className="crumb-sep" aria-hidden="true">
                /
              </span>
              <span className="crumb-current">{copy.header.lesson(current.id)}</span>
            </>
          ) : (
            <span className="crumb-current">{pathname === '/handbook' ? copy.header.handbook : copy.header.courseMap}</span>
          )}
        </div>
        <Link to="/handbook" className="handbook-link" aria-current={pathname === '/handbook' ? 'page' : undefined}>
          <BookIcon />
          <span>{copy.header.handbook}</span>
        </Link>
        <label className="language-picker">
          <span className="sr-only">{copy.language}</span>
          <select value={locale} onChange={event => setLocale(event.target.value as Locale)} aria-label={copy.language}>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </label>
        <nav className="progress" aria-label={copy.header.progressLabel}>
          <span className="progress-count">
            {copy.header.progress(completed.length, localizedLessons.length)}
          </span>
          <ol className="dots">
            {localizedLessons.map(lesson => {
              const done = completed.includes(lesson.id)
              const open = isUnlocked(lesson.prerequisite, completed)
              const label = copy.header.lessonState(lesson.id, lesson.title, done ? 'complete' : open ? 'open' : 'locked')
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
