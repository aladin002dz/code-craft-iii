// Effect instrumentation for the inspector and the checks.
//
// Learner code imports "react" from the frame. That module is React itself, except
// `useEffect`, which is wrapped to count how often each effect runs and cleans up and to
// remember the dependencies it last ran with. The wrapper calls the real useEffect with the
// learner's own dependency array, so React decides when the effect runs, exactly as it would
// without the wrapper. The counts live in a ref that inspect.ts finds on the component's fiber.

import * as React from 'react'

export const EFFECT_RECORD = Symbol.for('state-quest.effect')

export type EffectRecord = {
  [EFFECT_RECORD]: true
  runs: number
  /** Calls of cleanup functions the effect returned. */
  cleanups: number
  /** Dependencies of the latest run; null when the effect has no dependency array. */
  deps: unknown[] | null
}

const listeners = new Set<() => void>()

/** Called whenever an effect sets up or cleans up, which React does not report as a commit. */
export function onEffectActivity(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const notify = () => listeners.forEach(listener => listener())

export const isEffectRecord = (value: unknown): value is EffectRecord =>
  typeof value === 'object' && value !== null && (value as Partial<EffectRecord>)[EFFECT_RECORD] === true

function useTrackedEffect(create: React.EffectCallback, deps?: React.DependencyList) {
  const ref = React.useRef<EffectRecord | null>(null)
  if (ref.current === null) ref.current = { [EFFECT_RECORD]: true, runs: 0, cleanups: 0, deps: null }
  const record = ref.current
  React.useEffect(() => {
    record.runs++
    record.deps = deps ? [...deps] : null
    notify()
    const destroy = create()
    // Only a cleanup the learner wrote is counted, so a missing cleanup shows as "cleaned up 0×".
    if (typeof destroy !== 'function') return
    return () => {
      record.cleanups++
      notify()
      destroy()
    }
    // The learner's own dependency array decides when this runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** The "react" module learner code receives. */
export const learnerReact: Record<string, unknown> = { ...React, useEffect: useTrackedEffect }
learnerReact.default = learnerReact
