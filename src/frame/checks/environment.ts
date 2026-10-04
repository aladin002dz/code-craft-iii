// A controlled browser environment for one check.
//
// Effects talk to the world outside React: timers, window events, the window size. Checks
// replace those parts of `window` while they run so they can move time forward instantly,
// count the listeners a component leaves behind, and resize the window. Learner code still
// calls the ordinary browser functions; it never knows it is being checked.
//
// React captures its own scheduling functions when it loads, so faking timers here changes
// only timers created by learner and supplied project code.

type Timer = { id: number; at: number; callback: () => void; every: number | null }
type Tracked = { type: string; listener: EventListenerOrEventListenerObject; capture: boolean }

const real = {
  setTimeout: globalThis.setTimeout.bind(globalThis),
  clearTimeout: globalThis.clearTimeout.bind(globalThis),
  setInterval: globalThis.setInterval.bind(globalThis),
  clearInterval: globalThis.clearInterval.bind(globalThis),
  dateNow: Date.now,
}

/** Wait for real time to pass, unaffected by the fake clock. */
export const realDelay = (ms: number) => new Promise<void>(resolve => real.setTimeout(resolve, ms))

const MAX_TIMER_RUNS = 2000
const FIRST_FAKE_ID = 1_000_000_000

export type Environment = {
  /** Move fake time forward, running due timers in order and letting React render between them. */
  advance(ms: number): Promise<void>
  /** Fake timers waiting to run (pending timeouts plus active intervals). */
  pendingTimers(): number
  /** Listeners currently registered on window for this event type. */
  windowListeners(type: string): number
  /** Pretend the window is `width` pixels wide and fire a resize event. */
  resizeWindow(width: number): void
  restore(): void
}

export function installEnvironment(onError: (error: unknown) => void): Environment {
  const target = globalThis as unknown as Record<string, unknown>
  // Under jsdom (unit tests) the window is a separate object from the global scope.
  const win = (globalThis.window ?? globalThis) as unknown as Record<string, unknown> & EventTarget
  const timers = new Map<number, Timer>()
  let nextId = FIRST_FAKE_ID
  let now = 0
  const startedAt = real.dateNow()

  const schedule = (callback: unknown, ms: unknown, args: unknown[], repeat: boolean) => {
    const id = nextId++
    const delay = Math.max(0, Number(ms) || 0)
    const run = () => (typeof callback === 'function' ? callback(...args) : undefined)
    timers.set(id, { id, at: now + delay, callback: run, every: repeat ? Math.max(1, delay) : null })
    return id
  }
  const clear = (id: unknown, fallback: (id: never) => void) => {
    if (typeof id === 'number' && timers.has(id)) timers.delete(id)
    else fallback(id as never)
  }

  const patched: Record<string, unknown> = {
    setTimeout: (callback: unknown, ms?: unknown, ...args: unknown[]) => schedule(callback, ms, args, false),
    setInterval: (callback: unknown, ms?: unknown, ...args: unknown[]) => schedule(callback, ms, args, true),
    clearTimeout: (id: unknown) => clear(id, real.clearTimeout),
    clearInterval: (id: unknown) => clear(id, real.clearInterval),
  }
  const replaced: { on: Record<string, unknown>; key: string; descriptor: PropertyDescriptor | undefined }[] = []
  const replace = (key: string, value: unknown, on: Record<string, unknown> = target) => {
    replaced.push({ on, key, descriptor: Object.getOwnPropertyDescriptor(on, key) })
    Object.defineProperty(on, key, { value, configurable: true, writable: true })
  }
  Object.entries(patched).forEach(([key, value]) => replace(key, value))
  Date.now = () => startedAt + now

  // Track window listeners while still registering them for real.
  const tracked: Tracked[] = []
  // The window's own functions: under jsdom they are already bound to the real window.
  const add = win.addEventListener as EventTarget["addEventListener"]
  const remove = win.removeEventListener as EventTarget["removeEventListener"]
  const captureOf = (options: unknown) => (typeof options === 'boolean' ? options : Boolean((options as { capture?: boolean } | undefined)?.capture))
  replace('addEventListener', function (this: EventTarget | undefined, type: string, listener: EventListenerOrEventListenerObject | null, options?: unknown) {
    if (listener) {
      const capture = captureOf(options)
      if (!tracked.some(item => item.type === type && item.listener === listener && item.capture === capture)) tracked.push({ type, listener, capture })
    }
    return add.call(this ?? win, type, listener, options as AddEventListenerOptions)
  }, win)
  replace('removeEventListener', function (this: EventTarget | undefined, type: string, listener: EventListenerOrEventListenerObject | null, options?: unknown) {
    const capture = captureOf(options)
    const index = tracked.findIndex(item => item.type === type && item.listener === listener && item.capture === capture)
    if (index >= 0) tracked.splice(index, 1)
    return remove.call(this ?? win, type, listener, options as EventListenerOptions)
  }, win)


  return {
    async advance(ms) {
      const end = now + Math.max(0, ms)
      for (let runs = 0; runs < MAX_TIMER_RUNS; runs++) {
        let due: Timer | null = null
        for (const timer of timers.values()) if (timer.at <= end && (!due || timer.at < due.at)) due = timer
        if (!due) break
        now = due.at
        if (due.every === null) timers.delete(due.id)
        else due.at += due.every
        try {
          due.callback()
        } catch (error) {
          onError(error)
        }
        // Let promises settle and React render, as the browser would between timer callbacks.
        await realDelay(0)
      }
      now = end
      await realDelay(20)
    },
    pendingTimers: () => timers.size,
    windowListeners: type => tracked.filter(item => item.type === type).length,
    resizeWindow(width) {
      if (!replaced.some(item => item.key === 'innerWidth')) replace('innerWidth', width, win)
      else win.innerWidth = width
      win.dispatchEvent(new Event('resize'))
    },
    restore() {
      timers.clear()
      Date.now = real.dateNow
      for (const { on, key, descriptor } of replaced.reverse()) {
        if (descriptor) Object.defineProperty(on, key, descriptor)
        else delete on[key]
      }
    },
  }
}
