// Supplied project code: a pretend server for the effects course.
//
// The preview frame has no network access, so this module replaces the frame's `fetch` with
// one that answers a few `/api/...` routes with JSON after a realistic delay. Learner code calls
// the ordinary `fetch(url).then(response => response.json())`. Every request is listed by
// `NetworkLog` (import it from './network.js'), so repeated or out-of-order requests are visible.
// Delays use the global setTimeout, so checks can fast-forward them with their fake clock.
import { createElement as h, useSyncExternalStore } from 'react'

type Route = { status: number; body: unknown; delay: number }
type LogEntry = { id: number; url: string; status: number | null }

const team = [
  { id: 'ada', name: 'Ada Lovelace', role: 'Engine lead' },
  { id: 'grace', name: 'Grace Hopper', role: 'Compilers' },
  { id: 'linus', name: 'Linus Torvalds', role: 'Kernel' },
]

// Ada's profile is slow on purpose, so a quick switch shows responses arriving out of order.
const profiles: Record<string, { body: unknown; delay: number }> = {
  ada: { body: { id: 'ada', name: 'Ada Lovelace', role: 'Analytical engine lead', status: 'Writing notes' }, delay: 1500 },
  grace: { body: { id: 'grace', name: 'Grace Hopper', role: 'Compiler engineer', status: 'Debugging' }, delay: 300 },
  linus: { body: { id: 'linus', name: 'Linus Torvalds', role: 'Kernel maintainer', status: 'Reviewing patches' }, delay: 700 },
}

function route(path: string): Route {
  if (path === '/api/team') return { status: 200, body: team, delay: 600 }
  const profile = /^\/api\/profiles\/([\w-]+)$/.exec(path)
  if (profile && profiles[profile[1]]) return { status: 200, ...profiles[profile[1]] }
  return { status: 404, body: { error: `No route for ${path}` }, delay: 200 }
}

let entries: LogEntry[] = []
let total = 0
/** Every requested path since the last reset; the log only shows the most recent few. */
const allPaths: string[] = []
const listeners = new Set<() => void>()
const changed = () => listeners.forEach(listener => listener())

function pathOf(input: unknown): string {
  const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as { url?: string })?.url ?? String(input)
  try {
    return new URL(raw, 'https://code-craft.local').pathname
  } catch {
    return raw
  }
}

function mockFetch(input: unknown, init?: { signal?: AbortSignal }): Promise<Response> {
  const path = pathOf(input)
  const entry: LogEntry = { id: ++total, url: path, status: null }
  allPaths.push(path)
  entries = [...entries, entry].slice(-6)
  changed()
  const { status, body, delay } = route(path)
  return new Promise((resolve, reject) => {
    const signal = init?.signal
    const abort = () => {
      clearTimeout(timer)
      update(entry, 0)
      reject(new DOMException('The request was aborted.', 'AbortError'))
    }
    if (signal?.aborted) {
      abort()
      return
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      update(entry, status)
      resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }))
    }, delay)
    signal?.addEventListener('abort', abort)
  })
}

function update(entry: LogEntry, status: number) {
  entries = entries.map(item => (item.id === entry.id ? { ...item, status } : item))
  changed()
}

/** Install the pretend server as the frame's `fetch`. Called once when the frame runtime loads. */
export function installMockServer() {
  globalThis.fetch = mockFetch as typeof fetch
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const snapshot = () => entries

/** Shows recent requests and how many have been sent, like a browser's network panel. */
export function NetworkLog() {
  const log = useSyncExternalStore(subscribe, snapshot)
  return h(
    'div',
    { className: 'connection-log network-log', 'aria-label': 'Network log' },
    h('div', { className: 'log-head' }, h('span', null, 'Network'), h('strong', null, `${total} ${total === 1 ? 'request' : 'requests'}`)),
    h(
      'ol',
      null,
      log.map(entry =>
        h(
          'li',
          { key: entry.id, className: entry.status === null ? 'pending' : entry.status === 200 ? 'connect' : 'disconnect' },
          `GET ${entry.url} · ${entry.status === null ? 'pending…' : entry.status === 0 ? 'cancelled' : entry.status}`,
        ),
      ),
    ),
  )
}

/** Requests started since the last reset, optionally only those for one path. For checks. */
export const requestCount = (path?: string) => (path ? allPaths.filter(item => item === path).length : total)

export function resetNetwork() {
  entries = []
  total = 0
  allPaths.length = 0
  changed()
}
