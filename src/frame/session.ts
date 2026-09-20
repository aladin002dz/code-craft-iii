// The one code path that runs learner code and checks. The real preview frame and the
// unit tests both use it, so tests exercise exactly what learners get.
import './hook-install'
import { checksByLesson } from './checks'
import { runChecks } from './checks/run'
import type { CheckOutcome } from './protocol'
import { evaluateComponent, mountComponent, type Mounted } from './runtime'

export function describeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  return message.length > 500 ? `${message.slice(0, 500)}…` : message
}

/** Evaluate compiled learner code and render it. Throws if the code cannot be evaluated. */
export function runCode(container: HTMLElement, js: string, onError: (error: unknown) => void): Mounted {
  return mountComponent(container, evaluateComponent(js), onError)
}

/** Run a lesson's checks against `js`, in `container`. Never throws: failures become outcomes. */
export async function runLessonChecks(lessonId: number, js: string, container: HTMLElement): Promise<CheckOutcome[]> {
  const defs = checksByLesson[lessonId] ?? []
  const errors: string[] = []
  const record = (error: unknown) => errors.push(describeError(error))
  const onWindowError = (event: ErrorEvent) => record(event.error ?? event.message)
  globalThis.addEventListener('error', onWindowError)
  let mounted: Mounted | null = null
  try {
    mounted = runCode(container, js, record)
  } catch (error) {
    const message = `Your code has an error, so the checks could not run: ${describeError(error)}`
    return defs.map(def => ({ id: def.id, passed: false, message }))
  }
  try {
    return await runChecks(defs, mounted, container, errors)
  } finally {
    globalThis.removeEventListener('error', onWindowError)
    mounted.unmount()
  }
}
