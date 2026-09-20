import type { Objective } from '../lessons/types'

export type CheckRun = {
  /** The exact code that was checked. */
  code: string
  outcomes: Record<string, { passed: boolean; message: string | null }>
}

export type ObjectiveView = {
  id: string
  label: string
  state: 'passed' | 'failed' | 'pending'
  message: string | null
}

export type LessonStatus = {
  objectives: ObjectiveView[]
  /** The last check run was for the code currently in the editor. */
  runIsCurrent: boolean
  passedCount: number
  /** Every objective passes for the code in the editor right now. */
  allPassed: boolean
  /** Completion counts once earned, even if the code is edited afterwards. */
  completed: boolean
  headline: 'complete' | 'failing' | 'unchecked' | 'edited-after-complete'
}

/**
 * The single authoritative status of a lesson. The checklist, the summary pill and the
 * Next button all render from this, so they can never disagree.
 */
export function deriveStatus(objectives: Objective[], code: string, run: CheckRun | null, completedBefore: boolean): LessonStatus {
  const runIsCurrent = run !== null && run.code === code
  const views = objectives.map((objective): ObjectiveView => {
    const outcome = runIsCurrent ? run.outcomes[objective.id] : undefined
    return {
      id: objective.id,
      label: objective.label,
      state: !outcome ? 'pending' : outcome.passed ? 'passed' : 'failed',
      message: outcome && !outcome.passed ? outcome.message : null,
    }
  })
  const passedCount = views.filter(view => view.state === 'passed').length
  const allPassed = runIsCurrent && passedCount === objectives.length
  const completed = completedBefore || allPassed
  const headline = allPassed
    ? 'complete'
    : runIsCurrent
      ? 'failing'
      : completed
        ? 'edited-after-complete'
        : 'unchecked'
  return { objectives: views, runIsCurrent, passedCount, allPassed, completed, headline }
}
