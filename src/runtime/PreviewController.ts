import { CHANNEL, parseFrameMessage, type CheckOutcome, type HostMessage, type StateSnapshot } from '../frame/protocol'

export type PreviewEvents = {
  /** The newest code finished rendering and is now visible. */
  onRendered(): void
  onState(snapshot: StateSnapshot): void
  /** Runtime error from the visible preview; null clears it. */
  onError(message: string | null): void
  /** New code stopped the frame (`loop`, e.g. an infinite loop) or the frame never started (`start`). */
  onUnresponsive(reason: 'loop' | 'start'): void
}

export type ChecksResult = { status: 'done'; outcomes: CheckOutcome[] } | { status: 'timeout' }

type Entry = {
  iframe: HTMLIFrameElement
  token: string
  code: string
  purpose: 'preview' | 'checks'
  initialised: boolean
  rendered: boolean
  error: string | null
  state: StateSnapshot | null
  /** Runs until the frame says it is ready; startup can be slow on a busy machine. */
  startTimer: number
  /** Runs from init until the first render; only learner code should make this expire. */
  renderTimer: number
  onChecks?: (result: ChecksResult) => void
}

// Starting a sandboxed frame can take seconds on a busy machine, so that wait is generous.
// Once the frame has its code, rendering should be quick: exceeding it means a loop.
const START_TIMEOUT_MS = 20000
const RENDER_TIMEOUT_MS = 5000
const CHECKS_TIMEOUT_MS = 15000

function newToken() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Owns the sandboxed preview iframes. Learner code only ever runs inside them, in an
 * opaque origin (`sandbox="allow-scripts"`), so it cannot touch the app or its storage.
 * Every incoming message is matched to a frame by its window, then by its secret token.
 */
export class PreviewController {
  private entries: Entry[] = []
  private visible: Entry | null = null
  private readonly onMessage = (event: MessageEvent) => this.receive(event)

  constructor(
    private readonly container: HTMLElement,
    private readonly frameHtml: string,
    private readonly lessonId: number,
    private readonly events: PreviewEvents,
  ) {
    window.addEventListener('message', this.onMessage)
  }

  /** Render new code. The previous preview stays visible until the new one is ready. */
  load(code: string) {
    // Only the newest pending frame matters; drop older ones that never finished.
    this.entries.filter(entry => entry.purpose === 'preview' && entry !== this.visible).forEach(entry => this.dispose(entry))
    const entry = this.spawn(code, 'preview')
    entry.iframe.title = 'Live preview'
    // Pending frames are laid out but invisible. display:none would let the browser deprioritise
    // the frame's process, delaying its start.
    entry.iframe.className = 'preview-frame pending'
    entry.startTimer = window.setTimeout(() => {
      this.dispose(entry)
      this.events.onUnresponsive('start')
    }, START_TIMEOUT_MS)
  }

  /** Run the lesson's checks against `code` in a hidden frame, leaving the visible preview alone. */
  runChecks(code: string): Promise<ChecksResult> {
    return new Promise(resolve => {
      const entry = this.spawn(code, 'checks')
      entry.iframe.className = 'checks-frame'
      entry.iframe.setAttribute('aria-hidden', 'true')
      entry.iframe.tabIndex = -1
      entry.onChecks = result => {
        this.dispose(entry)
        resolve(result)
      }
      entry.startTimer = window.setTimeout(() => entry.onChecks?.({ status: 'timeout' }), CHECKS_TIMEOUT_MS)
    })
  }

  destroy() {
    window.removeEventListener('message', this.onMessage)
    this.entries.slice().forEach(entry => this.dispose(entry))
  }

  private spawn(code: string, purpose: Entry['purpose']): Entry {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.referrerPolicy = 'no-referrer'
    const entry: Entry = { iframe, token: newToken(), code, purpose, initialised: false, rendered: false, error: null, state: null, startTimer: 0, renderTimer: 0 }
    this.entries.push(entry)
    iframe.srcdoc = this.frameHtml
    this.container.append(iframe)
    return entry
  }

  private dispose(entry: Entry) {
    window.clearTimeout(entry.startTimer)
    window.clearTimeout(entry.renderTimer)
    entry.iframe.remove()
    this.entries = this.entries.filter(item => item !== entry)
    if (this.visible === entry) this.visible = null
  }

  private post(entry: Entry, message: HostMessage) {
    entry.iframe.contentWindow?.postMessage(message, '*')
  }

  private receive(event: MessageEvent) {
    // A sandboxed frame without same-origin access always reports the opaque origin "null".
    if (event.origin !== 'null') return
    const entry = this.entries.find(item => item.iframe.contentWindow !== null && item.iframe.contentWindow === event.source)
    if (!entry) return
    const message = parseFrameMessage(event.data)
    if (!message) return

    if (message.kind === 'ready') {
      if (entry.initialised) return
      entry.initialised = true
      this.post(entry, { channel: CHANNEL, kind: 'init', token: entry.token, code: entry.code, lessonId: this.lessonId })
      if (entry.purpose === 'preview') {
        window.clearTimeout(entry.startTimer)
        entry.renderTimer = window.setTimeout(() => {
          this.dispose(entry)
          this.events.onUnresponsive('loop')
        }, RENDER_TIMEOUT_MS)
      }
      return
    }
    if (message.token !== entry.token) return

    switch (message.kind) {
      case 'state':
        entry.state = message.snapshot
        if (entry === this.visible) this.events.onState(message.snapshot)
        break
      case 'runtime-error':
        entry.error = message.message
        if (entry === this.visible) this.events.onError(message.message)
        break
      case 'rendered':
        entry.rendered = true
        window.clearTimeout(entry.renderTimer)
        if (entry.purpose === 'checks') {
          this.post(entry, { channel: CHANNEL, kind: 'run-checks', token: entry.token })
        } else {
          this.show(entry)
        }
        break
      case 'checks':
        if (entry.purpose === 'checks') entry.onChecks?.({ status: 'done', outcomes: message.results })
        break
    }
  }

  private show(entry: Entry) {
    const previous = this.visible
    this.visible = entry
    entry.iframe.classList.remove('pending')
    if (previous) this.dispose(previous)
    this.events.onError(entry.error)
    this.events.onState(entry.state ?? [])
    this.events.onRendered()
  }
}
