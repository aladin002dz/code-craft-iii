import type { CheckOutcome } from '../protocol'
import type { Mounted } from '../runtime'
import { CheckFailure, createCheckContext, type CheckContext } from './context'

export type CheckDef = {
  /** Matches an objective id in the lesson definition. */
  id: string
  run(ctx: CheckContext): Promise<void>
}

/**
 * Run every check against a freshly mounted copy of the learner's component so one
 * check's clicks never leak into the next. Each check reports pass/fail independently.
 */
export async function runChecks(defs: CheckDef[], mounted: Mounted, container: HTMLElement, runtimeErrors: string[]): Promise<CheckOutcome[]> {
  const results: CheckOutcome[] = []
  for (const def of defs) {
    runtimeErrors.length = 0
    mounted.remount()
    const ctx = createCheckContext(container, () => runtimeErrors[0] ?? null)
    await ctx.settle().catch(() => undefined)
    try {
      await def.run(ctx)
      if (runtimeErrors.length > 0) throw new CheckFailure(`Your code threw an error: ${runtimeErrors[0]}`)
      results.push({ id: def.id, passed: true, message: null })
    } catch (error) {
      // A render or event error explains more than the "element not found" it causes.
      let message =
        runtimeErrors.length > 0
          ? `Your code threw an error: ${runtimeErrors[0]}`
          : error instanceof CheckFailure
            ? error.message
            : `This check could not finish: ${error instanceof Error ? error.message : String(error)}`
      if (/not extensible|read.only|cannot assign to read.only|object is not extensible/i.test(message)) {
        message += ' This usually means state was changed in place. Make a new object or array before calling the setter.'
      }
      results.push({ id: def.id, passed: false, message })
    }
  }
  return results
}
