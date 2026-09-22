import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { StateSnapshot } from '../frame/protocol'
import type { Lesson } from '../lessons/types'
import { compileLearnerCode } from '../runtime/compile'
import { findFocusLines } from '../runtime/focus'
import { buildInspector } from '../runtime/inspector'
import { frameDocument, loadFrameRuntime } from '../runtime/frameDocument'
import { PreviewController } from '../runtime/PreviewController'
import { deriveStatus, type CheckRun } from '../runtime/status'
import { clearDraft, draftStore, markComplete, preferenceStore, progressStore, saveDraft, useStore } from '../state/stores'
import { CodeEditor, type LineMark } from './CodeEditor'
import { Inspector } from './Inspector'
import { Sidebar, type SidebarTab } from './Sidebar'
import { useMediaQuery } from './useMediaQuery'
import { useI18n } from '../i18n/I18nProvider'
import { localizeCheckMessage } from '../i18n/checks'
import type { UiCopy } from '../i18n/ui'

type Panel = 'lesson' | 'code' | 'preview'
type Failure = { code: string; message: string; line: number | null }

const PREVIEW_DELAY_MS = 350
const DRAFT_DELAY_MS = 500

export function Workspace({ lesson, next }: { lesson: Lesson; next: Lesson | null }) {
  const { locale, copy } = useI18n()
  const completedIds = useStore(progressStore).completed
  const wide = useMediaQuery('(min-width: 1180px)')
  const tablet = useMediaQuery('(min-width: 900px) and (max-width: 1179px)')
  const collapsed = useStore(preferenceStore).sidebarCollapsed && wide
  const completedBefore = completedIds.includes(lesson.id)

  const [code, setCode] = useState(() => draftStore.get()[lesson.id] ?? lesson.starter)
  const [run, setRun] = useState<CheckRun | null>(null)
  const [checking, setChecking] = useState(false)
  const [snapshot, setSnapshot] = useState<StateSnapshot>([])
  const [runtimeReady, setRuntimeReady] = useState(false)
  const [previewReady, setPreviewReady] = useState(false)
  /** The code the visible preview is rendering, so we can tell when it is behind the editor. */
  const [renderedCode, setRenderedCode] = useState<string | null>(null)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [compileFailure, setCompileFailure] = useState<Failure | null>(null)
  const [unresponsive, setUnresponsive] = useState<'loop' | 'start' | null>(null)
  const [hintsShown, setHintsShown] = useState(0)
  const [panel, setPanel] = useState<Panel>('code')
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('instructions')
  const [narrowPreview, setNarrowPreview] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const stage = useRef<HTMLDivElement>(null)
  const controller = useRef<PreviewController | null>(null)
  const loadingCode = useRef<string | null>(null)
  const latestCode = useRef(code)
  latestCode.current = code

  // The preview controller lives as long as this lesson is open.
  useEffect(() => {
    let cancelled = false
    let instance: PreviewController | null = null
    loadFrameRuntime().then(script => {
      if (cancelled) return
      instance = new PreviewController(stage.current!, frameDocument(script), lesson.id, {
        onRendered: () => {
          setRenderedCode(loadingCode.current)
          setPreviewReady(true)
          setUnresponsive(null)
        },
        onState: setSnapshot,
        onError: setRuntimeError,
        onUnresponsive: setUnresponsive,
      })
      controller.current = instance
      setRuntimeReady(true)
    })
    return () => {
      cancelled = true
      instance?.destroy()
      controller.current = null
      setRuntimeReady(false)
    }
  }, [lesson.id])

  // Compile and refresh the preview shortly after the learner stops typing.
  const firstLoad = useRef(true)
  useEffect(() => {
    if (!runtimeReady) return
    const delay = firstLoad.current ? 0 : PREVIEW_DELAY_MS
    const timer = window.setTimeout(() => {
      firstLoad.current = false
      const compiled = compileLearnerCode(code, lesson.filename)
      if (compiled.ok) {
        setCompileFailure(null)
        setUnresponsive(null)
        loadingCode.current = code
        controller.current?.load(compiled.js)
      } else {
        // Keep the last working preview visible and explain what to fix.
        setCompileFailure({ code, message: compiled.message, line: compiled.line })
      }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [code, lesson.filename, runtimeReady])

  // Save drafts shortly after typing, and flush when leaving.
  useEffect(() => {
    const timer = window.setTimeout(() => persistDraft(lesson, code), DRAFT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [code, lesson])
  useEffect(() => {
    const flush = () => persistDraft(lesson, latestCode.current)
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [lesson])

  const status = useMemo(() => deriveStatus(lesson.objectives, code, run, completedBefore), [lesson.objectives, code, run, completedBefore])

  const runChecks = useCallback(async () => {
    const checked = latestCode.current
    const compiled = compileLearnerCode(checked, lesson.filename)
    const outcomes: CheckRun['outcomes'] = {}
    setChecking(true)
    setPanel(current => (current === 'code' && window.matchMedia('(max-width: 1179px)').matches ? 'lesson' : current))
    setSidebarTab('instructions')
    try {
      if (!compiled.ok) {
        const where = compiled.line ? copy.workspace.line(compiled.line) : ''
        const message = copy.workspace.syntaxFirst(where, compiled.message)
        lesson.objectives.forEach(objective => (outcomes[objective.id] = { passed: false, message }))
      } else {
        const result = await controller.current?.runChecks(compiled.js)
        if (result?.status === 'done') {
          result.outcomes.forEach(outcome => (outcomes[outcome.id] = {
            passed: outcome.passed,
            message: localizeCheckMessage(locale, lesson.id, outcome.id, outcome.message),
          }))
        } else {
          const message = copy.workspace.checksTimedOut
          lesson.objectives.forEach(objective => (outcomes[objective.id] = { passed: false, message }))
        }
      }
      // A missing outcome is a failure, so a check that never reported cannot pass by omission.
      lesson.objectives.forEach(objective => (outcomes[objective.id] ??= { passed: false, message: copy.workspace.objectiveUnchecked }))
      const finished: CheckRun = { code: checked, outcomes }
      setRun(finished)
      const passed = lesson.objectives.filter(objective => outcomes[objective.id].passed).length
      const all = passed === lesson.objectives.length
      if (all) markComplete(lesson.id)
      setAnnouncement(all ? copy.workspace.allPassedAnnouncement(passed) : copy.workspace.somePassedAnnouncement(passed, lesson.objectives.length))
    } finally {
      setChecking(false)
    }
  }, [lesson, locale, copy])

  function reset() {
    clearDraft(lesson.id)
    setCode(lesson.starter)
    setRun(null)
    setConfirmReset(false)
    setAnnouncement(copy.workspace.resetAnnouncement)
  }

  const marks = useMemo<LineMark[]>(() => {
    const focus = findFocusLines(code, lesson.focus)
    return compileFailure && compileFailure.code === code && compileFailure.line ? [...focus, { line: compileFailure.line, kind: 'error' }] : focus
  }, [code, lesson.focus, compileFailure])

  const inspector = useMemo(() => buildInspector(snapshot, code), [snapshot, code])
  const errorText = describeProblem(compileFailure, unresponsive, runtimeError, copy)

  const summary = {
    complete: copy.workspace.checksPassed(status.passedCount, lesson.objectives.length),
    failing: copy.workspace.checksPassed(status.passedCount, lesson.objectives.length),
    unchecked: copy.workspace.notRun,
    'edited-after-complete': copy.workspace.editedAfter,
  }[status.headline]

  return (
    <div className={`workspace${collapsed ? ' sidebar-collapsed' : ''}`} data-panel={panel}>
      <nav className="panel-tabs" aria-label={copy.workspace.panels}>
        {(['lesson', 'code', 'preview'] as const).map(id => (
          <button key={id} aria-pressed={(tablet && panel === 'preview' ? 'code' : panel) === id} onClick={() => setPanel(id)}>
            {id === 'lesson' ? copy.workspace.panelLesson : id === 'code' ? copy.workspace.panelCode : copy.workspace.panelPreview}
          </button>
        ))}
      </nav>

      <div className="area-sidebar">
        <Sidebar
          lesson={lesson}
          tab={sidebarTab}
          onTab={setSidebarTab}
          collapsed={collapsed}
          onToggleCollapsed={() => preferenceStore.set({ ...preferenceStore.get(), sidebarCollapsed: !collapsed })}
          canCollapse={wide}
          objectives={status.objectives}
          checking={checking}
          hintsShown={hintsShown}
          onNextHint={() => setHintsShown(count => Math.min(count + 1, lesson.hints.length))}
        />
      </div>

      <section className="area-editor pane" aria-label={copy.workspace.editor} dir="ltr">
        <header className="pane-header">
          <h2 className="file-title">
            <span aria-hidden="true">▤</span> {lesson.filename}
          </h2>
          <span className="editor-language">React · JSX</span>
        </header>
        <CodeEditor value={code} onChange={setCode} marks={marks} label={copy.workspace.editorFor(lesson.filename)} onRun={runChecks} />
        <div className="editor-footer" id="editor-help">
          <span>{copy.workspace.runShortcut}</span>
          <span>{copy.workspace.leaveEditor}</span>
        </div>
      </section>

      <section className="area-preview" aria-label={copy.workspace.previewAndInspector}>
        <div className="pane preview-pane">
          <header className="pane-header">
            <h2>{copy.workspace.livePreview}</h2>
            <span className="pane-note preview-freshness" aria-live="off">
              {compileFailure ? copy.workspace.paused : renderedCode === code ? copy.workspace.upToDate : copy.workspace.updating}
            </span>
            <div className="device-toggle" role="group" aria-label={copy.workspace.previewWidth}>
              <button aria-pressed={!narrowPreview} onClick={() => setNarrowPreview(false)} aria-label={copy.workspace.fullWidth} title={copy.workspace.fullWidth}>
                ▭
              </button>
              <button aria-pressed={narrowPreview} onClick={() => setNarrowPreview(true)} aria-label={copy.workspace.phoneWidth} title={copy.workspace.phoneWidth}>
                ▯
              </button>
            </div>
          </header>
          <AnimatePresence initial={false}>
            {errorText && (
              <motion.div
                key="error"
                className="preview-error"
                role="alert"
                data-testid="preview-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {errorText}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="preview-stage" data-narrow={narrowPreview} data-ready={previewReady} data-fresh={renderedCode === code} ref={stage}>
            {!previewReady && <div className="preview-loading">{copy.workspace.startingPreview}</div>}
          </div>
        </div>
        <Inspector groups={inspector} running={previewReady} />
      </section>

      <footer className="area-actions action-bar">
        <div className="action-left">
          {confirmReset ? (
            <div className="confirm-reset" role="alertdialog" aria-label={copy.workspace.resetQuestion}>
              <span>{copy.workspace.resetQuestion}</span>
              <button className="btn danger" onClick={reset}>
                {copy.workspace.yesReset}
              </button>
              <button className="btn" onClick={() => setConfirmReset(false)}>
                {copy.workspace.cancel}
              </button>
            </div>
          ) : (
            <>
              <button className="btn" onClick={() => setConfirmReset(true)}>
                <span aria-hidden="true">↺</span> {copy.workspace.reset}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setHintsShown(count => Math.min(count + 1, lesson.hints.length))
                  setSidebarTab('instructions')
                  setPanel('lesson')
                }}
                disabled={hintsShown >= lesson.hints.length}
              >
                <span aria-hidden="true">💡</span> {hintsShown > 0 ? copy.workspace.hintCount(hintsShown, lesson.hints.length) : copy.workspace.hint}
              </button>
            </>
          )}
        </div>
        <div className="action-right">
          <button className="btn run" onClick={runChecks} disabled={checking || !runtimeReady} data-testid="run-checks">
            {checking ? copy.workspace.runningChecks : copy.workspace.runChecks}
          </button>
          <span className={`status-pill ${status.headline}`} data-testid="status-pill">
            {status.headline === 'complete' && <span aria-hidden="true">✓ </span>}
            {summary}
          </span>
          {next ? (
            status.completed ? (
              <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: String(next.id) }} data-testid="next-lesson">
                {copy.workspace.nextLesson} <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
              </Link>
            ) : (
              <button className="btn primary" disabled aria-describedby="next-help" data-testid="next-lesson">
                {copy.workspace.nextLesson} <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
              </button>
            )
          ) : status.completed ? (
            <Link className="btn primary" to="/" data-testid="next-lesson">
              {copy.workspace.finishCourse}
            </Link>
          ) : (
            <button className="btn primary" disabled aria-describedby="next-help" data-testid="next-lesson">
              {copy.workspace.finishCourse}
            </button>
          )}
          {!status.completed && (
            <span id="next-help" className="sr-only">
              {copy.workspace.passToContinue}
            </span>
          )}
        </div>
      </footer>
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </div>
  )
}

/** The single message shown above the preview, most fundamental problem first. */
function describeProblem(
  compileFailure: Failure | null,
  unresponsive: 'loop' | 'start' | null,
  runtimeError: string | null,
  copy: UiCopy,
): string | null {
  if (compileFailure) {
    const where = compileFailure.line ? copy.workspace.line(compileFailure.line) : ''
    return copy.workspace.syntaxError(where, compileFailure.message)
  }
  if (unresponsive === 'loop') return copy.workspace.loopError
  if (unresponsive === 'start') return copy.workspace.startError
  return runtimeError ? copy.workspace.runtimeError(runtimeError) : null
}

function persistDraft(lesson: Lesson, code: string) {
  if (code === lesson.starter) clearDraft(lesson.id)
  else if (draftStore.get()[lesson.id] !== code) saveDraft(lesson.id, code)
}
