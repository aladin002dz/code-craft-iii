// Runs a lesson's real checks against learner code in jsdom, using the same compile and
// frame code paths as the browser preview.
import '../src/frame/hook-install'
import { runLessonChecks } from '../src/frame/session'
import { compileLearnerCode } from '../src/runtime/compile'
import { lessons } from '../src/lessons'

export type Results = Record<string, { passed: boolean; message: string | null }>

export async function checkLesson(lessonId: number, code: string): Promise<Results> {
  const lesson = lessons.find(item => item.id === lessonId)!
  const compiled = compileLearnerCode(code, lesson.filename)
  if (!compiled.ok) throw new Error(`Fixture does not compile: ${compiled.message}`)
  const container = document.createElement('div')
  document.body.append(container)
  try {
    const outcomes = await runLessonChecks(lessonId, compiled.js, container)
    return Object.fromEntries(outcomes.map(outcome => [outcome.id, { passed: outcome.passed, message: outcome.message }]))
  } finally {
    container.remove()
  }
}

/** Replace `find` in the lesson's starter, failing loudly if the starter changed. */
export function patchStarter(lessonId: number, find: string | RegExp, replacement: string): string {
  const starter = lessons.find(item => item.id === lessonId)!.starter
  const patched = starter.replace(find, replacement)
  if (patched === starter) throw new Error(`Starter for lesson ${lessonId} does not contain ${String(find)}`)
  return patched
}
