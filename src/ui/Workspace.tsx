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

type Panel = 'lesson' | 'code' | 'preview'
type Failure = { code: string; message: string; line: number | null }

const PREVIEW_DELAY_MS = 350
const DRAFT_DELAY_MS = 500

export function Workspace({ lesson, next }: { lesson: Lesson; next: Lesson | null }) {
  const completedIds = useStore(progressStore).completed
  const wide = useMediaQuery('(min-width: 1180px)')
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
        const where = compiled.line ? ` on line ${compiled.line}` : ''
        const message = `Fix the syntax error${where} first: ${compiled.message}`
        lesson.objectives.forEach(objective => (outcomes[objective.id] = { passed: false, message }))
      } else {
        const result = await controller.current?.runChecks(compiled.js)
        if (result?.status === 'done') {
          result.outcomes.forEach(outcome => (outcomes[outcome.id] = { passed: outcome.passed, message: outcome.message }))
        } else {
          const message = 'The checks did not finish. Look for a loop that never ends.'
          lesson.objectives.forEach(objective => (outcomes[objective.id] = { passed: false, message }))
        }
      }
      // A missing outcome is a failure, so a check that never reported cannot pass by omission.
      lesson.objectives.forEach(objective => (outcomes[objective.id] ??= { passed: false, message: 'This objective could not be checked.' }))
      const finished: CheckRun = { code: checked, outcomes }
      setRun(finished)
      const passed = lesson.objectives.filter(objective => outcomes[objective.id].passed).length
      const all = passed === lesson.objectives.length
      if (all) markComplete(lesson.id)
      setAnnouncement(all ? `All ${passed} checks passed. Lesson complete.` : `${passed} of ${lesson.objectives.length} checks passed.`)
    } finally {
      setChecking(false)
    }
  }, [lesson])

  function reset() {
    clearDraft(lesson.id)
    setCode(lesson.starter)
    setRun(null)
    setConfirmReset(false)
    setAnnouncement('Code reset to the starting point.')
  }

  const marks = useMemo<LineMark[]>(() => {
    const focus = findFocusLines(code, lesson.focus)
    return compileFailure && compileFailure.code === code && compileFailure.line ? [...focus, { line: compileFailure.line, kind: 'error' }] : focus
  }, [code, lesson.focus, compileFailure])

  const inspector = useMemo(() => buildInspector(snapshot, code), [snapshot, code])
  const errorText = describeProblem(compileFailure, unresponsive, runtimeError)

  const summary = {
    complete: `${status.passedCount} of ${lesson.objectives.length} checks passed`,
    failing: `${status.passedCount} of ${lesson.objectives.length} checks passed`,
    unchecked: 'Checks not run yet',
    'edited-after-complete': 'Completed. Run checks again after editing',
  }[status.headline]

  return (
    <div className={`workspace${collapsed ? ' sidebar-collapsed' : ''}`} data-panel={panel}>
      <nav className="panel-tabs" aria-label="Workspace panels">
        {(['lesson', 'code', 'preview'] as const).map(id => (
          <button key={id} aria-pressed={panel === id} onClick={() => setPanel(id)}>
            {id === 'lesson' ? 'Lesson' : id === 'code' ? 'Code' : 'Preview'}
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

      <section className="area-editor pane" aria-label="Code editor">
        <header className="pane-header">
          <h2 className="file-title">
            <span aria-hidden="true">▤</span> {lesson.filename}
          </h2>
          <span className="pane-note" id="editor-help">
            Ctrl+Enter runs checks · Esc then Tab leaves the editor
          </span>
        </header>
        <CodeEditor value={code} onChange={setCode} marks={marks} label={`Code editor for ${lesson.filename}`} onRun={runChecks} />
      </section>

      <section className="area-preview" aria-label="Preview and inspector">
        <div className="pane preview-pane">
          <header className="pane-header">
            <h2>Live preview</h2>
            <span className="pane-note preview-freshness" aria-live="off">
              {compileFailure ? 'Paused: fix the error' : renderedCode === code ? 'Up to date' : 'Updating…'}
            </span>
            <div className="device-toggle" role="group" aria-label="Preview width">
              <button aria-pressed={!narrowPreview} onClick={() => setNarrowPreview(false)} aria-label="Full width" title="Full width">
                ▭
              </button>
              <button aria-pressed={narrowPreview} onClick={() => setNarrowPreview(true)} aria-label="Phone width" title="Phone width">
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
            {!previewReady && <div className="preview-loading">Starting preview…</div>}
          </div>
        </div>
        <Inspector groups={inspector} running={previewReady} />
      </section>

      <footer className="area-actions action-bar">
        <div className="action-left">
          {confirmReset ? (
            <div className="confirm-reset" role="alertdialog" aria-label="Confirm reset">
              <span>Discard your code for this lesson?</span>
              <button className="btn danger" onClick={reset}>
                Yes, reset
              </button>
              <button className="btn" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button className="btn" onClick={() => setConfirmReset(true)}>
                <span aria-hidden="true">↺</span> Reset
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
                <span aria-hidden="true">💡</span> Hint{hintsShown > 0 ? ` (${hintsShown}/${lesson.hints.length})` : ''}
              </button>
            </>
          )}
        </div>
        <div className="action-right">
          <button className="btn run" onClick={runChecks} disabled={checking || !runtimeReady} data-testid="run-checks">
            {checking ? 'Running checks…' : 'Run checks'}
          </button>
          <span className={`status-pill ${status.headline}`} data-testid="status-pill">
            {status.headline === 'complete' && <span aria-hidden="true">✓ </span>}
            {summary}
          </span>
          {next ? (
            status.completed ? (
              <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: String(next.id) }} data-testid="next-lesson">
                Next lesson <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <button className="btn primary" disabled aria-describedby="next-help" data-testid="next-lesson">
                Next lesson <span aria-hidden="true">→</span>
              </button>
            )
          ) : status.completed ? (
            <Link className="btn primary" to="/" data-testid="next-lesson">
              Finish course
            </Link>
          ) : (
            <button className="btn primary" disabled aria-describedby="next-help" data-testid="next-lesson">
              Finish course
            </button>
          )}
          {!status.completed && (
            <span id="next-help" className="sr-only">
              Pass every check to continue.
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
function describeProblem(compileFailure: Failure | null, unresponsive: 'loop' | 'start' | null, runtimeError: string | null): string | null {
  if (compileFailure) {
    const where = compileFailure.line ? ` on line ${compileFailure.line}` : ''
    return `Syntax error${where}: ${compileFailure.message}. Showing the last working preview.`
  }
  if (unresponsive === 'loop') return 'The preview stopped responding. Check for a loop that never ends.'
  if (unresponsive === 'start') return 'The preview could not start. Edit the code to try again, or reload the page.'
  return runtimeError ? `Runtime error: ${runtimeError}` : null
}

function persistDraft(lesson: Lesson, code: string) {
  if (code === lesson.starter) clearDraft(lesson.id)
  else if (draftStore.get()[lesson.id] !== code) saveDraft(lesson.id, code)
}
