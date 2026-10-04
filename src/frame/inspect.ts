// State inspection without touching learner code.
//
// React reports every committed tree to a global devtools hook if one exists when
// react-dom loads. We install a tiny one (see hook-install.ts) and read the state
// hooks of the components we rendered. This shows what React actually holds, not
// what the component chooses to display.

import { isEffectRecord, onEffectActivity, type EffectRecord } from './effects'
import type { ComponentState, JsonValue, StateSnapshot } from './protocol'

type Hook = { memoizedState: unknown; queue: { dispatch?: unknown } | null; next: Hook | null }
type Fiber = {
  tag: number
  key: string | null
  type: unknown
  memoizedState: Hook | null
  child: Fiber | null
  sibling: Fiber | null
}
type FiberRoot = { current: Fiber; containerInfo: unknown }

// Fiber tags for function components: FunctionComponent, ForwardRef, SimpleMemoComponent.
const FUNCTION_TAGS = new Set([0, 11, 15])

let watchedContainer: unknown = null
let watchedRoot: FiberRoot | null = null
const listeners = new Set<() => void>()

/** Track the React root that renders into `container`. */
export function watchContainer(container: unknown) {
  watchedContainer = container
  watchedRoot = null
}

export function onCommit(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Effects run after a commit and do not commit themselves; report them the same way.
onEffectActivity(() => {
  if (watchedRoot) listeners.forEach(listener => listener())
})

export function handleCommit(root: FiberRoot) {
  if (root.containerInfo !== watchedContainer) return
  watchedRoot = root
  listeners.forEach(listener => listener())
}

function componentName(type: unknown): string {
  if (typeof type === 'function') return (type as { displayName?: string }).displayName || type.name || 'Anonymous'
  if (type && typeof type === 'object') {
    const named = type as { displayName?: string; render?: { name?: string } }
    return named.displayName || named.render?.name || 'Anonymous'
  }
  return 'Anonymous'
}

export function toJson(value: unknown, depth = 0): JsonValue {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return value
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value)
  if (value === undefined) return '‹undefined›'
  if (typeof value === 'function') return '‹function›'
  if (typeof value === 'bigint' || typeof value === 'symbol') return String(value)
  if (depth >= 6) return '…'
  if (Array.isArray(value)) return value.slice(0, 50).map(item => toJson(item, depth + 1))
  if (typeof value === 'object') {
    const out: { [key: string]: JsonValue } = {}
    for (const [key, item] of Object.entries(value as object).slice(0, 50)) out[key] = toJson(item, depth + 1)
    return out
  }
  return String(value)
}

type Found = { fiber: Fiber; hooks: unknown[]; effects: EffectRecord[] }

function visit(fiber: Fiber | null, found: Found[]) {
  for (let current = fiber; current; current = current.sibling) {
    if (FUNCTION_TAGS.has(current.tag)) {
      const hooks: unknown[] = []
      const effects: EffectRecord[] = []
      for (let hook = current.memoizedState; hook; hook = hook.next) {
        // useState and useReducer own an update queue; refs, memos and effects do not.
        if (hook.queue && typeof hook.queue.dispatch === 'function') hooks.push(hook.memoizedState)
        // The useEffect wrapper keeps its counts in a ref (see effects.ts).
        const ref = hook.memoizedState as { current?: unknown } | null
        if (!hook.queue && ref && typeof ref === 'object' && isEffectRecord(ref.current)) effects.push(ref.current)
      }
      if (hooks.length > 0 || effects.length > 0) found.push({ fiber: current, hooks, effects })
    }
    visit(current.child, found)
  }
}

export type RawComponentState = { component: string; key: string | null; values: unknown[]; effects: EffectRecord[] }

/** Raw (unserialised) state values, used by checks so they can inspect and freeze real objects. */
export function readRawState(): RawComponentState[] {
  if (!watchedRoot) return []
  const found: Found[] = []
  visit(watchedRoot.current.child, found)
  return found.map(({ fiber, hooks, effects }) => ({ component: componentName(fiber.type), key: fiber.key, values: hooks, effects }))
}

export function readSnapshot(): StateSnapshot {
  return readRawState().map(
    (entry): ComponentState => ({
      component: entry.component,
      key: entry.key,
      values: entry.values.map(v => toJson(v)),
      effects: entry.effects.map(effect => ({
        runs: effect.runs,
        cleanups: effect.cleanups,
        deps: effect.deps ? effect.deps.map(dep => toJson(dep)) : null,
      })),
    }),
  )
}
