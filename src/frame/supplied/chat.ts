// Supplied project code: a pretend chat server for the effects course, importable from
// learner code as './chat.js'. It keeps a visible log of every connect and disconnect so
// learners can see what their effects do, and lets checks ask which rooms are still open.
import { createElement as h, useSyncExternalStore } from 'react'

type LogEntry = { id: number; kind: 'connect' | 'disconnect'; roomId: string }

let entries: LogEntry[] = []
let open: string[] = []
let nextId = 1
const listeners = new Set<() => void>()

function record(kind: LogEntry['kind'], roomId: string) {
  entries = [...entries, { id: nextId++, kind, roomId }].slice(-8)
  listeners.forEach(listener => listener())
}

export function createConnection(roomId: string) {
  let connected = false
  return {
    connect() {
      if (connected) return
      connected = true
      open = [...open, String(roomId)]
      record('connect', String(roomId))
    },
    disconnect() {
      if (!connected) return
      connected = false
      const index = open.indexOf(String(roomId))
      open = open.filter((_, position) => position !== index)
      record('disconnect', String(roomId))
    },
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const snapshot = () => entries

/** Shows the server's view: recent connection events and how many connections are open. */
export function ConnectionLog() {
  const log = useSyncExternalStore(subscribe, snapshot)
  return h(
    'div',
    { className: 'connection-log', 'aria-label': 'Connection log' },
    h('div', { className: 'log-head' }, h('span', null, 'Server log'), h('strong', null, `${open.length} open`)),
    h(
      'ol',
      null,
      log.map(entry =>
        h('li', { key: entry.id, className: entry.kind }, entry.kind === 'connect' ? `✅ Connected to #${entry.roomId}` : `❌ Disconnected from #${entry.roomId}`),
      ),
    ),
  )
}

/** Rooms with an open connection, in the order they connected. For checks. */
export const openRooms = () => [...open]

export function resetChat() {
  entries = []
  open = []
  nextId = 1
  listeners.forEach(listener => listener())
}
