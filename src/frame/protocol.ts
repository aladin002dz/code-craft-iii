// Messages exchanged between the app (host) and the sandboxed preview frame.
// The frame runs learner code, so every message it sends is treated as untrusted
// input and validated here before the host uses it.

export const CHANNEL = 'state-quest'

export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

/** State hooks (useState/useReducer) of one rendered component instance, in call order. */
export type ComponentState = { component: string; key: string | null; values: JsonValue[] }
export type StateSnapshot = ComponentState[]

export type CheckOutcome = { id: string; passed: boolean; message: string | null }

export type HostMessage =
  | { channel: typeof CHANNEL; kind: 'init'; token: string; code: string; lessonId: number }
  | { channel: typeof CHANNEL; kind: 'run-checks'; token: string }

export type FrameMessage =
  | { channel: typeof CHANNEL; kind: 'ready' }
  | { channel: typeof CHANNEL; kind: 'rendered'; token: string }
  | { channel: typeof CHANNEL; kind: 'state'; token: string; snapshot: StateSnapshot }
  | { channel: typeof CHANNEL; kind: 'runtime-error'; token: string; message: string }
  | { channel: typeof CHANNEL; kind: 'checks'; token: string; results: CheckOutcome[] }

const MAX_TEXT = 20_000
const MAX_ITEMS = 500
const MAX_DEPTH = 8

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isText = (value: unknown, max = MAX_TEXT): value is string => typeof value === 'string' && value.length <= max

function isJsonValue(value: unknown, depth = 0): value is JsonValue {
  if (depth > MAX_DEPTH) return false
  if (value === null || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value === 'string') return value.length <= MAX_TEXT
  if (Array.isArray(value)) return value.length <= MAX_ITEMS && value.every(item => isJsonValue(item, depth + 1))
  if (isRecord(value)) {
    const entries = Object.entries(value)
    return entries.length <= MAX_ITEMS && entries.every(([, item]) => isJsonValue(item, depth + 1))
  }
  return false
}

function isSnapshot(value: unknown): value is StateSnapshot {
  return (
    Array.isArray(value) &&
    value.length <= MAX_ITEMS &&
    value.every(
      entry =>
        isRecord(entry) &&
        isText(entry.component, 200) &&
        (entry.key === null || isText(entry.key, 200)) &&
        Array.isArray(entry.values) &&
        entry.values.length <= MAX_ITEMS &&
        entry.values.every(item => isJsonValue(item)),
    )
  )
}

function isOutcomes(value: unknown): value is CheckOutcome[] {
  return (
    Array.isArray(value) &&
    value.length <= 50 &&
    value.every(
      entry =>
        isRecord(entry) &&
        isText(entry.id, 100) &&
        typeof entry.passed === 'boolean' &&
        (entry.message === null || isText(entry.message, 1000)),
    )
  )
}

export function parseFrameMessage(data: unknown): FrameMessage | null {
  if (!isRecord(data) || data.channel !== CHANNEL) return null
  switch (data.kind) {
    case 'ready':
      return { channel: CHANNEL, kind: 'ready' }
    case 'rendered':
      return isText(data.token, 100) ? { channel: CHANNEL, kind: 'rendered', token: data.token } : null
    case 'state':
      return isText(data.token, 100) && isSnapshot(data.snapshot)
        ? { channel: CHANNEL, kind: 'state', token: data.token, snapshot: data.snapshot }
        : null
    case 'runtime-error':
      return isText(data.token, 100) && isText(data.message, 2000)
        ? { channel: CHANNEL, kind: 'runtime-error', token: data.token, message: data.message }
        : null
    case 'checks':
      return isText(data.token, 100) && isOutcomes(data.results)
        ? { channel: CHANNEL, kind: 'checks', token: data.token, results: data.results }
        : null
    default:
      return null
  }
}

export function parseHostMessage(data: unknown): HostMessage | null {
  if (!isRecord(data) || data.channel !== CHANNEL) return null
  if (data.kind === 'init' && isText(data.token, 100) && isText(data.code, 200_000) && Number.isInteger(data.lessonId)) {
    return { channel: CHANNEL, kind: 'init', token: data.token, code: data.code, lessonId: data.lessonId as number }
  }
  if (data.kind === 'run-checks' && isText(data.token, 100)) {
    return { channel: CHANNEL, kind: 'run-checks', token: data.token }
  }
  return null
}
