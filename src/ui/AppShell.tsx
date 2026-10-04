import { Link, Outlet, useParams, useLocation } from '@tanstack/react-router'
import { courseLessons, getLesson, isCourseId, lessonNumber, lessons } from '../lessons'
import { isUnlocked, progressStore, useStore } from '../state/stores'
import { BookIcon } from './BookIcon'
import { BrandMark } from './BrandMark'
import { handbookPath } from './CoursePage'
import { useI18n } from '../i18n/I18nProvider'
import { localizeLessons } from '../i18n/lessons'
import type { CourseId } from '../lessons/types'
import type { Locale } from '../state/stores'
import { useMemo } from 'react'

/** The course the current page belongs to, or null on pages shared by every course. */
function useCurrentCourse(): CourseId | null {
  const { lessonId, courseId } = useParams({ strict: false })
  const pathname = useLocation({ select: location => location.pathname })
  if (lessonId) return getLesson(Number(lessonId))?.course ?? null
  if (courseId) return isCourseId(courseId) ? courseId : null
  if (pathname === '/handbook') return 'state'
  if (pathname === '/handbook/effects') return 'effects'
  return null
}

export function AppShell() {
  const { locale, copy, setLocale } = useI18n()
  const { lessonId } = useParams({ strict: false })
  const pathname = useLocation({ select: location => location.pathname })
  const course = useCurrentCourse()
  const localizedLessons = useMemo(() => (course ? courseLessons(localizeLessons(lessons, locale), course) : []), [locale, course])
  const completed = useStore(progressStore).completed
  const current = localizedLessons.find(lesson => String(lesson.id) === lessonId)
  const onHandbook = pathname.startsWith('/handbook')
  const doneHere = localizedLessons.filter(lesson => completed.includes(lesson.id)).length

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand" aria-label={copy.header.brandLabel}>
          <BrandMark />
          <span className="brand-name" aria-hidden="true">
            Code<span className="brand-accent">Craft</span>
          </span>
        </Link>
        <div className="crumbs">
          {course ? (
            <>
              <Link to="/course/$courseId" params={{ courseId: course }} className="crumb-link">
                {copy.courses[course].name}
              </Link>
              <span className="crumb-sep" aria-hidden="true">
                /
              </span>
              <span className="crumb-current">
                {current ? copy.header.lesson(lessonNumber(current.id)) : onHandbook ? copy.header.handbook : copy.header.courseMap}
              </span>
            </>
          ) : (
            <span className="crumb-current">{copy.header.home}</span>
          )}
        </div>
        {course && (
          <Link to={handbookPath(course)} className="handbook-link" aria-current={onHandbook ? 'page' : undefined}>
            <BookIcon />
            <span>{copy.header.handbook}</span>
          </Link>
        )}
        <label className="language-picker">
          <span className="sr-only">{copy.language}</span>
          <select value={locale} onChange={event => setLocale(event.target.value as Locale)} aria-label={copy.language}>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </label>
        {course && (
          <nav className="progress" aria-label={copy.header.progressLabel}>
            <span className="progress-count">{copy.header.progress(doneHere, localizedLessons.length)}</span>
            <ol className="dots">
              {localizedLessons.map(lesson => {
                const done = completed.includes(lesson.id)
                const open = isUnlocked(lesson.prerequisite, completed)
                const label = copy.header.lessonState(lessonNumber(lesson.id), lesson.title, done ? 'complete' : open ? 'open' : 'locked')
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
        )}
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
