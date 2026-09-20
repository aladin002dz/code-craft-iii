// Entry point of the sandboxed preview frame, bundled by vite-frame-plugin.ts and inlined
// into an iframe srcdoc. The frame has sandbox="allow-scripts" and no same-origin access, so learner
// code here cannot reach the app, its storage, or its cookies. The only channel is
// postMessage, which the host validates.
import { onCommit, readSnapshot } from './inspect'
import { CHANNEL, parseHostMessage, type FrameMessage } from './protocol'
import type { Mounted } from './runtime'
import { describeError, runCode, runLessonChecks } from './session'
import previewStyles from './preview.css?inline'

// The frame is a bare srcdoc page: it fetches nothing, so its styles are injected from the bundle.
const style = document.createElement('style')
style.textContent = previewStyles
document.head.append(style)

const root = document.getElementById('root')!
let token: string | null = null
let lessonId = 0
let code = ''
let lastState = ''
let mounted: Mounted | null = null

function send(message: FrameMessage) {
  window.parent.postMessage(message, '*')
}

const authed = <T extends FrameMessage>(build: (token: string) => T) => token && send(build(token))
const reportError = (error: unknown) => authed(t => ({ channel: CHANNEL, kind: 'runtime-error', token: t, message: describeError(error) }))

let checking = false
window.addEventListener('error', event => {
  if (!checking) reportError(event.error ?? event.message)
})
window.addEventListener('unhandledrejection', event => {
  if (!checking) reportError(event.reason)
})

onCommit(() => {
  // Wait for the commit to settle, then publish only if the values changed.
  setTimeout(() => {
    const snapshot = readSnapshot()
    const serialised = JSON.stringify(snapshot)
    if (serialised === lastState) return
    lastState = serialised
    authed(t => ({ channel: CHANNEL, kind: 'state', token: t, snapshot }))
  }, 0)
})

window.addEventListener('message', event => {
  if (event.source !== window.parent) return
  const message = parseHostMessage(event.data)
  if (!message) return

  if (message.kind === 'init') {
    if (token) return // the first init wins; later messages cannot re-target the frame
    token = message.token
    lessonId = message.lessonId
    code = message.code
    try {
      mounted = runCode(root, code, reportError)
      setTimeout(() => authed(t => ({ channel: CHANNEL, kind: 'rendered', token: t })), 50)
    } catch (error) {
      reportError(error)
      authed(t => ({ channel: CHANNEL, kind: 'rendered', token: t }))
    }
    return
  }

  if (message.kind === 'run-checks' && message.token === token) {
    checking = true
    mounted?.unmount()
    mounted = null
    runLessonChecks(lessonId, code, root)
      .then(results => authed(t => ({ channel: CHANNEL, kind: 'checks', token: t, results })))
      .finally(() => {
        checking = false
      })
  }
})

send({ channel: CHANNEL, kind: 'ready' })
