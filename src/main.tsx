import { RouterProvider, createHashHistory, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppShell } from './ui/AppShell'
import { CoursePage } from './ui/CoursePage'
import { LessonPage } from './ui/LessonPage'
import { HandbookPage } from './ui/HandbookPage'
import { I18nProvider } from './i18n/I18nProvider'
import './styles.css'

// Hash history keeps lesson links working on GitHub Pages, which cannot rewrite paths.
const rootRoute = createRootRoute({ component: AppShell })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: CoursePage })
const lessonRoute = createRoute({ getParentRoute: () => rootRoute, path: '/lesson/$lessonId', component: LessonPage })
const introductionRoute = createRoute({ getParentRoute: () => rootRoute, path: '/introduction', beforeLoad: () => { throw redirect({ to: '/handbook', replace: true }) } })
const handbookRoute = createRoute({ getParentRoute: () => rootRoute, path: '/handbook', component: HandbookPage })
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute, lessonRoute, introductionRoute, handbookRoute]), history: createHashHistory() })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      {/* "user" honours the OS reduced-motion setting for movement-based animation. */}
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </I18nProvider>
  </React.StrictMode>,
)
