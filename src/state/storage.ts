// Versioned, defensive localStorage. Storage can be missing (private windows, blocked
// site data) or hold junk from an older version; the app must keep working either way.

export type Store<T> = {
  get(): T
  set(next: T): void
  subscribe(listener: () => void): () => void
  /** Re-read from storage, e.g. after another tab changed it. */
  reload(): void
}

type StoreOptions<T> = {
  key: string
  version: number
  initial: () => T
  /** Return a valid value, or null to discard the stored data. Must not trust its input. */
  parse: (raw: unknown) => T | null
  storage?: () => Storage | undefined
}

function defaultStorage(): Storage | undefined {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

export function createStore<T>({ key, version, initial, parse, storage = defaultStorage }: StoreOptions<T>): Store<T> {
  const listeners = new Set<() => void>()

  function load(): T {
    try {
      const raw = storage()?.getItem(key)
      if (!raw) return initial()
      const envelope: unknown = JSON.parse(raw)
      if (typeof envelope !== 'object' || envelope === null || (envelope as { version?: unknown }).version !== version) return initial()
      return parse((envelope as { data?: unknown }).data) ?? initial()
    } catch {
      return initial()
    }
  }

  let value = load()

  return {
    get: () => value,
    set(next) {
      value = next
      try {
        storage()?.setItem(key, JSON.stringify({ version, data: next }))
      } catch {
        // Quota or blocked storage: keep working in memory for this session.
      }
      listeners.forEach(listener => listener())
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    reload() {
      value = load()
      listeners.forEach(listener => listener())
    },
  }
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
